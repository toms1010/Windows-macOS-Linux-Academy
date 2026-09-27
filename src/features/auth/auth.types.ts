import type { Session, User } from '@supabase/supabase-js';

/** Shared auth state shape (owned by the auth feature, consumed via useAuth). */
export interface AuthState {
  /** False when Supabase env vars are absent — auth UI explains setup instead. */
  configured: boolean;
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpInput extends AuthCredentials {
  fullName: string;
}
