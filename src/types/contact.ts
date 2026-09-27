export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  feedback: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

/** Untrusted JSON body — every field optional until validated. */
export interface ContactSubmitInput {
  name?: unknown;
  email?: unknown;
  feedback?: unknown;
}

export interface ContactApiSuccess {
  success: true;
  message: string;
  /** True when an identical recent message already existed (idempotent retry). */
  deduped?: boolean;
}

export interface ContactApiError {
  success: false;
  message: string;
  /** Machine-readable field errors, when the failure is a validation issue. */
  errors?: Partial<Record<'name' | 'email' | 'feedback', string>>;
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError;

export interface HealthResponse {
  status: 'ok';
  db: 'up' | 'down';
}
