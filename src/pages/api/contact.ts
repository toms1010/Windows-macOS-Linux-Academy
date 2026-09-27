import type { NextApiRequest, NextApiResponse } from 'next';
import { validateContact } from '@/validation/contact';
import { hasRecentDuplicate, insertContactMessage } from '@/lib/db';
import { clientKey, rateLimit } from '@/lib/rateLimit';
import { CONTACT_DEDUP_WINDOW_SECONDS, CONTACT_RATE_MAX, CONTACT_RATE_WINDOW_SECONDS } from '@/lib/constants';
import { getSupabase } from '@/lib/supabase';
import type { ContactApiResponse } from '@/types/contact';

function clientIp(req: NextApiRequest): string | undefined {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress;
}

export default function handler(req: NextApiRequest, res: NextApiResponse<ContactApiResponse>): void {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
    return;
  }

  const limited = rateLimit(
    `contact:${clientKey(clientIp(req), 'unknown')}`,
    CONTACT_RATE_MAX,
    CONTACT_RATE_WINDOW_SECONDS
  );
  if (!limited.allowed) {
    res.setHeader('Retry-After', String(limited.retryAfter));
    res
      .status(429)
      .json({ success: false, message: 'Too many messages. Please wait a minute and try again.' });
    return;
  }

  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ success: false, message: 'Please send your name, email and feedback as JSON.' });
    return;
  }

  const { valid, value, errors } = validateContact(body as Record<string, unknown>);
  if (!valid) {
    const first = errors.name ?? errors.email ?? errors.feedback ?? 'Please check your information and try again.';
    res.status(400).json({ success: false, message: first, errors });
    return;
  }

  try {
    // Idempotent retries: an identical message stored seconds ago (double
    // click, network retry) succeeds without creating a second record.
    if (hasRecentDuplicate(value.name, value.email, value.feedback, CONTACT_DEDUP_WINDOW_SECONDS)) {
      res.status(201).json({ success: true, message: 'Your feedback has been received.', deduped: true });
      return;
    }
    insertContactMessage(value.name, value.email, value.feedback);
    // Best-effort mirror to Supabase when configured (RLS anon-insert
    // policy applies). A mirror failure must never fail the request —
    // the local store is the reliable record. Server log only.
    try {
      const supabase = getSupabase();
      if (supabase) {
        supabase
          .from('contact_messages')
          .insert({ name: value.name, email: value.email, message: value.feedback })
          .then(({ error }) => {
            if (error) console.error('[contact] supabase mirror failed:', error.message);
          });
      }
    } catch (err) {
      console.error('[contact] supabase mirror error:', err instanceof Error ? err.message : err);
    }
    res.status(201).json({ success: true, message: 'Your feedback has been received.' });
  } catch {
    // Never leak SQL / stack traces to the client.
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
  }
}
