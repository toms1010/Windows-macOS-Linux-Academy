import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/features/auth/useAuth';
import { authService } from '@/features/auth/auth.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { configured, user, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const next = typeof router.query.next === 'string' ? router.query.next : '/profile';

  useEffect(() => {
    if (!loading && configured && user && router.isReady) {
      router.replace(next.startsWith('/') ? next : '/profile');
    }
  }, [loading, configured, user, router, next]);

  if (loading) return <p className="text-center text-muted-foreground py-10">Loading...</p>;

  if (!configured) {
    return (
      <AuthCard title="Sign in" subtitle="Welcome back" footerText="Don't have an account?" footerLinkHref="/signup" footerLinkLabel="Sign up">
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
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await authService.signIn(email.trim(), password);
      router.replace(next.startsWith('/') ? next : '/profile');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
      setBusy(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue"
        footerText="Don't have an account?"
        footerLinkHref="/signup"
        footerLinkLabel="Sign Up"
      >
        <form onSubmit={submit} noValidate className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-xl p-3" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="login-email"
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
            <label htmlFor="login-password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={busy}
                className="w-full glass p-3 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
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
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
          >
            {busy ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </AuthCard>
    </motion.div>
  );
}
