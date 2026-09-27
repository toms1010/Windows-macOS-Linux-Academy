import type { NextApiRequest, NextApiResponse } from 'next';
import { dbIsUp } from '@/lib/db';
import type { HealthResponse } from '@/types/contact';

export default function handler(req: NextApiRequest, res: NextApiResponse<HealthResponse>): void {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ status: 'ok', db: 'down' });
    return;
  }
  // Boolean only — no paths, versions, or error details leak out.
  res.status(200).json({ status: 'ok', db: dbIsUp() ? 'up' : 'down' });
}
