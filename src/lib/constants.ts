/** Shared application constants (no secrets here — ever). */
export const APP_NAME = 'Win vs Linux Academy';
export const QUIZ_ID = 'os-basics';

/** Contact API abuse protection. */
export const CONTACT_RATE_MAX = 10;
export const CONTACT_RATE_WINDOW_SECONDS = 60;
/** Identical resubmissions inside this window are treated as retries. */
export const CONTACT_DEDUP_WINDOW_SECONDS = 60;
