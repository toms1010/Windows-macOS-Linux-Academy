/**
 * Central error normalization. UI layers call these instead of
 * interpreting raw errors — technical details never reach users.
 */

/** Safely extract a message from anything thrown. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.length > 0) return error;
  return 'An unexpected error occurred.';
}

/** Map raw Supabase Auth errors to friendly, non-technical messages. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials') || m.includes('invalid email or password')) {
    return 'The email or password is incorrect.';
  }
  if (m.includes('email not confirmed') || m.includes('email not verified')) {
    return 'Please verify your email first — check your inbox for the confirmation link.';
  }
  if (m.includes('user already registered') || m.includes('already exists')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (m.includes('password')) {
    return 'Please choose a stronger password (at least 6 characters).';
  }
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Unable to reach the authentication server. Check your connection and try again.';
  }
  return 'Something went wrong. Please try again.';
}

/** Map database failures to readable, non-technical messages. */
export function friendlyDbError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('row-level security') || m.includes('permission') || m.includes('policy')) {
    return 'You do not have permission to save this. Try signing out and back in.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Could not reach the database. Your work is kept on this page.';
  }
  return 'Could not save. Your work is kept on this page.';
}
