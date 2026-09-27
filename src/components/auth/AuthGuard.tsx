import { useRouter } from 'next/router';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/features/auth/useAuth';

/**
 * Wraps protected pages: logged-out visitors go to /login (with a
 * `next` destination preserved); while the session restores, a loader shows.
 */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { configured, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!configured || !user) && router.isReady) {
      const next = encodeURIComponent(router.asPath);
      router.replace(`/login?next=${next}`);
    }
  }, [loading, configured, user, router]);

  if (loading) {
    return <p className="text-muted-foreground py-10 text-center">Loading...</p>;
  }
  if (!configured) {
    return (
      <div className="glass p-6 rounded-2xl max-w-xl mx-auto text-center space-y-2">
        <h1 className="text-2xl font-bold">Authentication not configured</h1>
        <p className="text-sm text-muted-foreground">
          This page needs Supabase credentials. Set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then reload.
        </p>
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}
