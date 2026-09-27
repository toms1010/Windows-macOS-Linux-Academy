import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/env';
import { authService } from './auth.service';
import type { AuthState } from './auth.types';

const AuthContext = createContext<AuthState>({
  configured: false,
  user: null,
  session: null,
  loading: true,
  signOut: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    let mounted = true;
    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    // Handles SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED.
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ configured, user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
