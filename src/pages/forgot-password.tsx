import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/features/auth/useAuth';
import { authService } from '@/features/auth/auth.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { configured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const redirectTo = `${window.location.origin}/update-password`;
      await authService.sendPasswordReset(email.trim(), redirectTo);
      // Neutral wording on purpose: never reveal whether the email exists.
      setSent(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to send the reset email. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <AuthCard title="Reset password" subtitle="Forgot password?" footerText="Remember it now?" footerLinkHref="/login" footerLinkLabel="Back to Login">
        <p className="text-sm text-muted-foreground text-center">
          Authentication needs Supabase credentials. Set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then reload.
        </p>
      </AuthCard>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuthCard
        title="Reset password"
        subtitle="We'll email you a reset link"
        footerText="Remember it now?"
        footerLinkHref="/login"
        footerLinkLabel="Back to Login"
      >
        {sent ? (
          <div className="text-center space-y-3">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto" aria-hidden="true" />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way. Open the email,
              set a new password, then return to login.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="space-y-4">
            {error && (
              <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl p-3" role="alert">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={busy}
                className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="email@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
            >
              {busy ? 'Sending reset email...' : 'Send Reset Email'}
            </button>
          </form>
        )}
      </AuthCard>
    </motion.div>
  );
}
