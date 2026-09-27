import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import { useAuth } from '@/features/auth/useAuth';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function AuthArea({ onNavigate }: { onNavigate?: () => void }) {
  const { configured, user, loading, signOut } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (loading || !configured) {
    // No Supabase credentials: keep a quiet Sign in link (page explains setup).
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs xl:text-sm font-medium hover:bg-primary/20 transition whitespace-nowrap"
      >
        Sign In
      </Link>
    );
  }
  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs xl:text-sm font-medium hover:bg-primary/20 transition whitespace-nowrap"
      >
        Sign In
      </Link>
    );
  }
  const logout = async () => {
    if (busy) return;
    setBusy(true);
    await signOut();
    onNavigate?.();
    router.push('/login');
  };
  return (
    <span className="flex items-center gap-1">
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition text-xs xl:text-sm font-medium max-w-[140px]"
        title={user.email ?? 'Profile'}
      >
        <FaUserCircle aria-hidden="true" className="shrink-0" />
        <span className="truncate">{user.email}</span>
      </Link>
      <button
        onClick={logout}
        disabled={busy}
        aria-label="Sign out"
        title="Sign out"
        className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition disabled:opacity-60"
      >
        <FaSignOutAlt aria-hidden="true" />
      </button>
    </span>
  );
}

interface NavbarProps {
  menuOpen: boolean;
  onMenuOpen: () => void;
  onMenuClose: () => void;
}

export default function Navbar({ menuOpen, onMenuOpen, onMenuClose }: NavbarProps) {
  const toggleMenu = () => (menuOpen ? onMenuClose() : onMenuOpen());

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/os-overview', label: 'Overview' },
    { href: '/comparison', label: 'Compare' },
    { href: '/evolution', label: 'Evolution' },
    { href: '/os', label: 'OS' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/commands', label: 'Commands' },
    { href: '/learning-hub', label: 'Hub' },
    { href: '/terminal-simulator', label: 'Terminal' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/20 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo with emoji */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold text-primary shrink-0 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0" aria-hidden="true">🖥️</span>
            <span className="truncate">Win vs Linux</span>
            <span className="hidden min-[380px]:inline text-sm font-normal text-muted-foreground shrink-0">| Academy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2.5 xl:px-3 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition text-xs xl:text-sm font-medium whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-1 flex items-center gap-1">
              <SearchBar />
              <ThemeToggle />
              <AuthArea />
            </div>
          </div>

          {/* Tablet Navigation - Condensed */}
          <div className="hidden md:flex lg:hidden items-center gap-0.5">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-1.5 py-1.5 rounded-lg hover:bg-primary/10 hover:text-primary transition text-xs font-medium"
              >
                {link.label}
              </Link>
            ))}
            <SearchBar />
            <ThemeToggle />
            <AuthArea />
            {/* Tablet hamburger opens the navigation drawer (single menu system) */}
            <button
              onClick={toggleMenu}
              className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-primary/10 rounded-lg transition"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Navigation — brand left, hamburger right */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2.5 min-w-[44px] min-h-[44px] hover:bg-primary/10 rounded-lg transition"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile full-width search */}
        <div className="md:hidden pb-3">
          <SearchBar inputClassName="!w-full" />
        </div>
      </div>
    </nav>
  );
}
