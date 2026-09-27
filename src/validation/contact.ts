import type { ContactSubmitInput } from '@/types/contact';

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  feedbackMin: 10,
  feedbackMax: 5000,
} as const;

export interface ValidatedContact {
  name: string;
  email: string;
  feedback: string;
}

export interface ContactValidation {
  valid: boolean;
  value: ValidatedContact;
  errors: Partial<Record<'name' | 'email' | 'feedback', string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Remove control characters (keep printable text + common whitespace). */
export function sanitizeText(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Shared by client and server so both enforce identical rules.
 * Never throws; returns structured field errors instead.
 */
export function validateContact(input: ContactSubmitInput): ContactValidation {
  const errors: ContactValidation['errors'] = {};

  const name = sanitizeText(asString(input.name));
  if (!name) {
    errors.name = 'Please enter your name.';
  } else if (name.length < LIMITS.nameMin) {
    errors.name = `Name must be at least ${LIMITS.nameMin} characters.`;
  } else if (name.length > LIMITS.nameMax) {
    errors.name = `Name must be at most ${LIMITS.nameMax} characters.`;
  }

  const email = sanitizeText(asString(input.email)).toLowerCase();
  if (!email) {
    errors.email = 'Please enter your email.';
  } else if (email.length > LIMITS.emailMax) {
    errors.email = 'That email address is too long.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please provide a valid email address.';
  }

  const feedback = sanitizeText(asString(input.feedback));
  if (!feedback) {
    errors.feedback = 'Please enter your feedback.';
  } else if (feedback.length < LIMITS.feedbackMin) {
    errors.feedback = `Please add a little more detail (at least ${LIMITS.feedbackMin} characters).`;
  } else if (feedback.length > LIMITS.feedbackMax) {
    errors.feedback = `Feedback must be at most ${LIMITS.feedbackMax} characters.`;
  }

  return { valid: Object.keys(errors).length === 0, value: { name, email, feedback }, errors };
}
