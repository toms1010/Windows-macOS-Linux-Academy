import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { NAV_SECTIONS } from './navSections';

/** The 9 primary routes, with icons — quick access at the top of the drawer. */
const QUICK_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/os-overview', label: 'Overview', icon: '📖' },
  { href: '/comparison', label: 'Compare', icon: '⚖️' },
  { href: '/evolution', label: 'Evolution', icon: '🕐' },
  { href: '/os', label: 'OS', icon: '💻' },
  { href: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { href: '/commands', label: 'Commands', icon: '⌨️' },
  { href: '/learning-hub', label: 'Hub', icon: '🎓' },
  { href: '/terminal-simulator', label: 'Terminal', icon: '🖥️' },
];

function QuickLinks({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1">
        {QUICK_LINKS.map(({ href, label, icon }) => {
          const active = router.pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 rounded-xl transition text-[15px] min-h-[48px] ${
                  active
                    ? 'bg-primary text-white font-semibold shadow'
                    : 'hover:bg-primary/10 hover:text-primary font-medium'
                }`}
              >
                <span className="text-xl w-7 text-center shrink-0" aria-hidden="true">
                  {icon}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  return (
    <nav className="flex flex-col gap-4" aria-label="Site sections">
      {NAV_SECTIONS.map((section, idx) => (
        <div key={idx}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
            {section.title}
          </p>
          {section.links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={router.pathname === href ? 'page' : undefined}
              className={`block px-3 py-2 rounded-lg transition text-sm min-h-[40px] flex items-center ${
                router.pathname === href
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-56 xl:w-64 shrink-0 p-3 border-r border-white/20 dark:border-white/5 glass m-3 rounded-2xl h-fit sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">
      <SidebarNav />
    </aside>
  );
}

/** Slide-in navigation drawer for mobile/tablet (the desktop sidebar is hidden there). */
export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-[60] bg-black/50"
          />
          <motion.aside
            id="mobile-nav-drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-y-0 left-0 z-[61] w-[85vw] max-w-xs glass border-r border-white/20 dark:border-white/10 p-4 overflow-y-auto scrollbar-thin"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-primary">🖥️ Win vs Linux</span>
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close navigation menu"
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg hover:bg-primary/10 transition"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>
            <QuickLinks onNavigate={onClose} />
            <div className="my-3 border-t border-white/20 dark:border-white/10" aria-hidden="true" />
            <SidebarNav onNavigate={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
