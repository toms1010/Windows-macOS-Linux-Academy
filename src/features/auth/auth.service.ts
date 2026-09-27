import { getSupabase } from '@/lib/supabase';
import { friendlyAuthError, getErrorMessage } from '@/utils/errors';
import type { SignUpInput } from './auth.types';

/**
 * Single entry point for all Supabase Auth operations.
 * UI layers call these functions — never `supabase.auth.*` directly.
 * Every function throws a plain Error with a user-safe message.
 */

function requireClient() {
  const client = getSupabase();
  if (!client) throw new Error('Authentication is not configured on this site.');
  return client;
}

export const authService = {
  async signUp({ email, password, fullName }: SignUpInput) {
    try {
      const { data, error } = await requireClient().auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw new Error(friendlyAuthError(error.message));
      return data;
    } catch (error) {
      throw new Error(friendlyAuthError(getErrorMessage(error)));
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { error } = await requireClient().auth.signInWithPassword({ email, password });
      if (error) throw new Error(friendlyAuthError(error.message));
    } catch (error) {
      throw new Error(friendlyAuthError(getErrorMessage(error)));
    }
  },

  async signOut(): Promise<void> {
    const client = getSupabase();
    if (client) await client.auth.signOut();
  },

  async getSessionUser() {
    try {
      const { data } = await requireClient().auth.getSession();
      return data.session?.user ?? null;
    } catch {
      return null;
    }
  },

  async sendPasswordReset(email: string, redirectTo: string): Promise<void> {
    try {
      const { error } = await requireClient().auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw new Error(friendlyAuthError(error.message));
    } catch (error) {
      throw new Error(friendlyAuthError(getErrorMessage(error)));
    }
  },

  async updatePassword(password: string): Promise<void> {
    try {
      const { error } = await requireClient().auth.updateUser({ password });
      if (error) throw new Error(friendlyAuthError(error.message));
    } catch (error) {
      throw new Error(friendlyAuthError(getErrorMessage(error)));
    }
  },

  async getProfileName(userId: string): Promise<string> {
    const { data } = await requireClient().from('profiles').select('full_name').eq('id', userId).maybeSingle();
    const row = data as { full_name?: string | null } | null;
    return row?.full_name ?? '';
  },

  async saveProfileName(userId: string, fullName: string): Promise<void> {
    const { error } = await requireClient().from('profiles').upsert({ id: userId, full_name: fullName });
    if (error) throw new Error('Could not save your profile. Please try again.');
  },
};
