import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle() {
  // Avoid hydration mismatch: next-themes only knows the theme on the client
  // after mount, so render a stable placeholder until then.
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-full glass hover:bg-primary/10 transition"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-slate-700 dark:text-slate-300" />}
    </button>
  );
}
