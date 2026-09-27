import { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';

const siteIndex = [
  { href: '/', title: 'Home', desc: 'Start here — Windows, macOS and Linux academy overview' },
  { href: '/os', title: 'What is an OS?', desc: 'Definition, components, file systems, GUI vs CLI' },
  { href: '/os-overview', title: 'OS Overview', desc: 'Hardware, software and user-interface management' },
  { href: '/comparison', title: 'OS Comparison', desc: 'Feature ratings and winners across Windows, macOS, Linux' },
  { href: '/os-comparison', title: 'Operating System Comparison', desc: 'Tabbed Windows vs Linux and triple comparison' },
  { href: '/triple-comparison', title: 'Windows vs macOS vs Linux', desc: 'Detailed triple comparison with distros' },
  { href: '/os-report', title: 'OS Research Report', desc: 'Charts, programming and cybersecurity recommendations' },
  { href: '/evolution', title: 'Evolution of Operating Systems', desc: 'Early systems, Windows and Android history' },
  { href: '/history', title: 'History Timeline', desc: 'Key milestones from Windows 1.0 to modern Linux' },
  { href: '/kernel', title: 'What is a Kernel?', desc: 'Core responsibilities and architecture diagram' },
  { href: '/kernel-types', title: 'Kernel Types', desc: 'Monolithic, microkernel, hybrid, exokernel, nanokernel' },
  { href: '/linux-architecture', title: 'Linux Architecture', desc: 'Applications, shell, libraries, kernel, hardware' },
  { href: '/windows-architecture', title: 'Windows Architecture', desc: 'Applications, Windows API, NT kernel, HAL' },
  { href: '/windows', title: 'Windows Overview', desc: 'NT kernel, NTFS, security, gaming, development' },
  { href: '/linux', title: 'Linux Overview', desc: 'Open-source kernel, distributions, shells' },
  { href: '/commands', title: 'Linux Command Reference', desc: 'Searchable command reference: ls, grep, chmod, ssh, docker, git and more' },
  { href: '/terminal-simulator', title: 'Linux Terminal Simulator', desc: 'Practice ls, cd, cat, mkdir plus guided debugging scenarios' },
  { href: '/ubuntu-guide', title: 'Ubuntu Server Guide', desc: 'Installation, SSH, networking, Nginx, Docker' },
  { href: '/projects', title: 'Ubuntu Projects', desc: 'Hands-on projects from backup to Docker server' },
  { href: '/roadmap', title: 'Backend Development Roadmap', desc: 'Progress tracker from fundamentals to Docker, PostgreSQL, testing, CI/CD and microservices, saved locally' },
  { href: '/learning-hub', title: 'Learning Hub', desc: 'Charts, quizzes, terminal, timelines and study tools' },
  { href: '/quiz', title: 'Interactive Quiz', desc: 'Test your OS knowledge with feedback, review, and generated questions' },
  { href: '/resources', title: 'Resources', desc: 'Documentation and tooling links' },
  { href: '/permissions', title: 'Linux Permissions Lab', desc: 'chmod calculator, symbolic mode, setuid/setgid/sticky, chown, umask' },
  { href: '/cpu-scheduling', title: 'CPU Scheduling Simulator', desc: 'FCFS, SJF, SRTF and Round Robin with Gantt chart, metrics and context switching' },
  { href: '/virtual-memory', title: 'Virtual Memory Simulator', desc: 'Pages, frames, TLB, Optimal, Belady anomaly, FIFO and LRU' },
  { href: '/filesystem-explorer', title: 'Filesystem Explorer', desc: 'Windows drives, System32 and Registry vs Linux FHS hierarchy, ACLs vs mode bits' },
  { href: '/system-calls', title: 'System Calls & strace Simulator', desc: 'Trace cat, echo, ls and animate Ring 3 to Ring 0 transitions' },
  { href: '/contact', title: 'Contact', desc: 'Send feedback to the academy team' },
  { href: '/login', title: 'Sign In', desc: 'Log in to your academy account' },
  { href: '/signup', title: 'Sign Up', desc: 'Create an academy account' },
  { href: '/profile', title: 'Profile', desc: 'View and update your profile (sign-in required)' },
];

export default function Search() {
  const router = useRouter();
  const raw = router.query.q;
  const q = Array.isArray(raw) ? raw[0] ?? '' : raw ?? '';
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    return siteIndex.filter(
      (page) =>
        page.title.toLowerCase().includes(query) ||
        page.desc.toLowerCase().includes(query) ||
        page.href.toLowerCase().includes(query)
    );
  }, [query]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold">
        {query ? (
          <>
            Search results for <span className="text-primary">&ldquo;{q.trim()}&rdquo;</span>
          </>
        ) : (
          'Search'
        )}
      </h1>

      {!router.isReady ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : !query ? (
        <div className="glass p-6 rounded-2xl">
          <p className="text-muted-foreground">
            Type a term in the search box above — try &ldquo;linux&rdquo;,
            &ldquo;kernel&rdquo; or &ldquo;terminal&rdquo;.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="glass p-6 rounded-2xl">
          <p className="text-muted-foreground">
            No results found for &ldquo;{q.trim()}&rdquo;. Try &ldquo;linux&rdquo;
            or &ldquo;kernel&rdquo;.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {results.length} result{results.length === 1 ? '' : 's'} found.
          </p>
          <ul className="grid gap-3">
            {results.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="block glass p-4 rounded-2xl hover:shadow-lg transition hover:border-primary/50 border border-white/10"
                >
                  <p className="font-semibold text-primary">{page.title}</p>
                  <p className="text-sm text-muted-foreground">{page.desc}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{page.href}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
