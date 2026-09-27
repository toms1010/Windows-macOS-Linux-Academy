import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/features/auth/useAuth';
import { authService } from '@/features/auth/auth.service';

export default function Profile() {
  return (
    <AuthGuard>
      <ProfileBody />
    </AuthGuard>
  );
}

function ProfileBody() {
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loadedName, setLoadedName] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      const name = (await authService.getProfileName(user.id)) || (user.user_metadata?.full_name as string | undefined) || '';
      if (!mounted) return;
      setFullName(name);
      setLoadedName(name);
      setLoadingProfile(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const name = fullName.trim();
    if (name.length < 2) {
      setNotice({ kind: 'err', text: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      if (!user) throw new Error('network');
      await authService.saveProfileName(user.id, name);
      setLoadedName(name);
      setNotice({ kind: 'ok', text: 'Profile saved.' });
    } catch {
      setNotice({ kind: 'err', text: 'Could not save your profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    await signOut();
    window.location.href = '/login';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">Your Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Signed in as {user?.email}</p>
      </div>
      <div className="glass rounded-3xl p-6 border border-white/20 dark:border-white/10">
        {loadingProfile ? (
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        ) : (
          <form onSubmit={save} noValidate className="space-y-4">
            {notice && (
              <p
                className={`text-sm rounded-xl p-3 border ${
                  notice.kind === 'ok'
                    ? 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30'
                    : 'text-red-500 bg-red-500/10 border-red-500/30'
                }`}
                role={notice.kind === 'ok' ? 'status' : 'alert'}
              >
                {notice.text}
              </p>
            )}
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={saving}
                className="w-full glass p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {loadedName !== fullName && (
                <p className="text-xs text-muted-foreground mt-1">Unsaved changes</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={logout}
                disabled={signingOut}
                className="px-6 py-2.5 glass rounded-full hover:bg-red-500/10 hover:text-red-500 transition disabled:opacity-60 text-sm font-medium flex items-center gap-2"
              >
                <FaSignOutAlt aria-hidden="true" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
