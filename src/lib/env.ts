/**
 * Centralized environment access. All credentials come from env vars —
 * nothing is hard-coded. Missing Supabase vars simply mean "unconfigured"
 * (the app degrades gracefully) rather than crashing at import time.
 */
function readEnv(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  supabaseUrl: readEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  contactDbPath: readEnv('CONTACT_DB_PATH'),
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
