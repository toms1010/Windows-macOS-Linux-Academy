import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/features/auth/useAuth';
import { authService } from '@/features/auth/auth.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const { configured, user, loading } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (!loading && configured && user && router.isReady) {
      router.replace('/profile');
    }
  }, [loading, configured, user, router]);

  if (loading) return <p className="text-center text-muted-foreground py-10">Loading...</p>;

  if (!configured) {
    return (
      <AuthCard title="Create Account" subtitle="Join the Academy" footerText="Already have an account?" footerLinkHref="/login" footerLinkLabel="Sign In">
        <p className="text-sm text-muted-foreground text-center">
          Authentication needs Supabase credentials. Set <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then reload.
        </p>
      </AuthCard>
    );
  }
  if (user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (fullName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
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
      const data = await authService.signUp({ email: email.trim(), password, fullName: fullName.trim() });
      // With email confirmation on there is no session yet — tell the user
      // to verify instead of pretending anything happened.
      if (!data.session) {
        setPendingEmail(email.trim());
        setBusy(false);
        return;
      }
      router.replace('/profile');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
      setBusy(false);
    }
  };

  if (pendingEmail) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AuthCard title="Account created!" subtitle="One more step" footerText="Verified already?" footerLinkHref="/login" footerLinkLabel="Back to Login">
          <div className="text-center space-y-3">
            <FaCheckCircle className="text-4xl text-green-500 mx-auto" aria-hidden="true" />
            <p className="text-sm text-muted-foreground" aria-live="polite">
              We&apos;ve sent a verification email to <strong>{pendingEmail}</strong>. Please verify your email before
              signing in.
            </p>
          </div>
        </AuthCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuthCard
        title="Create Account"
        subtitle="Join the Academy"
        footerText="Already have an account?"
        footerLinkHref="/login"
        footerLinkLabel="Sign In"
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl p-3" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="signup-name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={busy}
              className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy}
              className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                className="w-full glass p-3 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-1"
              >
                {show ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="signup-confirm" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              type={show ? 'text' : 'password'}
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
            {busy ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </AuthCard>
    </motion.div>
  );
}
