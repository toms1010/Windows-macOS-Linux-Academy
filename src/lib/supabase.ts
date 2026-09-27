import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from './env';

/**
 * Reusable Supabase browser client (lazy singleton).
 * Credentials come ONLY from env (see lib/env.ts) — never hard-coded.
 * The service-role key must NEVER appear in frontend code.
 */

let cached: SupabaseClient | null = null;
let attempted = false;

export { isSupabaseConfigured };

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  if (attempted) return null;
  attempted = true;
  if (!env.supabaseUrl || !env.supabaseAnonKey) return null;
  cached = createClient(env.supabaseUrl, env.supabaseAnonKey);
  return cached;
}
