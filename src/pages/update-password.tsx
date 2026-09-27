import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/features/auth/useAuth';
import { authService } from '@/features/auth/auth.service';

/** Landing page for Supabase recovery links — sets the new password. */
export default function UpdatePassword() {
  const { configured, loading } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase delivers the recovery session via URL hash; the client picks
  // it up automatically. Wait a beat, then check we actually have one.
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(async () => {
      const sessionUser = await authService.getSessionUser();
      setReady(!!sessionUser);
    }, 800);
    return () => clearTimeout(t);
  }, [loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (confirm !== password) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await authService.updatePassword(password);
      router.replace('/login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to update your password. Please try again.');
      setBusy(false);
    }
  };

  if (loading) return <p className="text-center text-muted-foreground py-10">Loading...</p>;

  if (!configured) {
    return (
      <AuthCard title="Set new password" subtitle="Password recovery" footerText="Back to" footerLinkHref="/login" footerLinkLabel="Login">
        <p className="text-sm text-muted-foreground text-center">Authentication is not configured on this site.</p>
      </AuthCard>
    );
  }

  if (!ready) {
    return (
      <AuthCard title="Set new password" subtitle="Password recovery" footerText="Link expired?" footerLinkHref="/forgot-password" footerLinkLabel="Request a new one">
        <p className="text-sm text-muted-foreground text-center" aria-live="polite">
          Waiting for the recovery session… If you opened this page directly (not from the email link), request a fresh
          reset email.
        </p>
      </AuthCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuthCard
        title="Set new password"
        subtitle="Choose something strong"
        footerText="Done?"
        footerLinkHref="/login"
        footerLinkLabel="Back to Login"
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl p-3" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={busy}
              className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label htmlFor="new-password-confirm" className="block text-sm font-medium mb-1">
              Confirm New Password
            </label>
            <input
              id="new-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={busy}
              className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Repeat your password"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
          >
            {busy ? 'Saving...' : 'Save New Password'}
          </button>
        </form>
      </AuthCard>
    </motion.div>
  );
}
