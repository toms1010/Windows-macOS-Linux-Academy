import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '@/components/ui/GlassCard';
import LabHeader from '@/components/labs/LabHeader';
import { FaRoad, FaUndo, FaCode, FaCogs, FaMicrochip, FaGlobe, FaDatabase, FaLock, FaFlask, FaDocker, FaProjectDiagram } from 'react-icons/fa';
import type { IconType } from 'react-icons';

export interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  description: string;
  prerequisites: string[];
  practice: string;
  project: string;
}

export type SkillStatus = 'not-started' | 'learning' | 'practicing' | 'completed';

const STORAGE_KEY = 'wla-roadmap-progress-v2';
const LEGACY_KEY = 'wla-roadmap-progress-v1';

const STATUSES: { id: SkillStatus; label: string; badge: string; dot: string }[] = [
  { id: 'not-started', label: 'Not started', badge: 'glass text-muted-foreground', dot: 'bg-gray-400' },
  { id: 'learning', label: 'Learning', badge: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  { id: 'practicing', label: 'Practicing', badge: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  { id: 'completed', label: 'Completed', badge: 'bg-green-500/15 text-green-600 dark:text-green-400', dot: 'bg-green-500' },
];

const NEXT_STATUS: Record<SkillStatus, SkillStatus> = {
  'not-started': 'learning',
  learning: 'practicing',
  practicing: 'completed',
  completed: 'not-started',
};

export const CATEGORY_ICONS: Record<string, IconType> = {
  Fundamentals: FaCode,
  Tooling: FaCogs,
  Systems: FaMicrochip,
  'Backend Framework': FaCode,
  APIs: FaGlobe,
  Databases: FaDatabase,
  Security: FaLock,
  Quality: FaFlask,
  DevOps: FaDocker,
  Architecture: FaProjectDiagram,
};

export function CategoryIcon({ category, className = '' }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] ?? FaRoad;
  return <Icon className={className} aria-hidden="true" />;
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: 'fundamentals', title: 'Programming Fundamentals', category: 'Fundamentals',
    description: 'Variables, control flow, functions, and basic data structures — the vocabulary everything else is written in.',
    prerequisites: [], practice: 'Solve 20 small CLI exercises (FizzBuzz, file counters).', project: 'A command-line TODO app with file storage.',
  },
  {
    id: 'javascript', title: 'JavaScript', category: 'Fundamentals',
    description: 'The language of the web backend (Node.js) and frontend alike: closures, promises, async/await.',
    prerequisites: ['Programming Fundamentals'], practice: 'Rewrite callbacks as async/await; parse JSON APIs.', project: 'Fetch and summarise a public REST API in Node.',
  },
  {
    id: 'git', title: 'Git & GitHub', category: 'Tooling',
    description: 'Version control: branching, merging, and collaborating without losing work.',
    prerequisites: ['Programming Fundamentals'], practice: 'Branch, rebase and resolve a merge conflict daily.', project: 'Put every later project on GitHub with meaningful commits.',
  },
  {
    id: 'linux', title: 'Linux Basics', category: 'Systems',
    description: 'The OS your servers run: filesystem, permissions, processes, SSH.',
    prerequisites: ['Programming Fundamentals'], practice: 'Do the Academy Permissions Lab and Terminal Simulator.', project: 'Turn a VPS into a dev server administered over SSH.',
  },
  {
    id: 'networking', title: 'Networking Basics', category: 'Systems',
    description: 'DNS, TCP/IP, ports, and what actually happens between “enter” and the response.',
    prerequisites: ['Linux Basics'], practice: 'Resolve, ping and curl your favourite sites; read headers.', project: 'Diagram the request path of a deployed app.',
  },
  {
    id: 'http', title: 'HTTP', category: 'Systems',
    description: 'Methods, status codes, headers, cookies — the contract every API speaks.',
    prerequisites: ['Networking Basics'], practice: 'Replay requests with curl and inspect status codes.', project: 'Document an API\u2019s endpoints with example requests.',
  },
  {
    id: 'nodejs', title: 'Node.js', category: 'Backend Framework',
    description: 'Event-loop JavaScript runtime for servers: modules, npm, streams.',
    prerequisites: ['JavaScript'], practice: 'Build CLIs with stdin/stdout and file streams.', project: 'A static file server from scratch (no framework).',
  },
  {
    id: 'express', title: 'Express.js', category: 'Backend Framework',
    description: 'Minimal web framework: routing, middleware, error handling.',
    prerequisites: ['Node.js', 'HTTP'], practice: 'Middleware chains: logging, auth, validation, errors.', project: 'REST API for the TODO app with proper status codes.',
  },
  {
    id: 'rest', title: 'REST API Design', category: 'APIs',
    description: 'Resource modelling, versioning, pagination, and idempotency.',
    prerequisites: ['Express.js'], practice: 'Redesign a CRUD API with pagination and filtering.', project: 'Versioned API (v1) with OpenAPI documentation.',
  },
  {
    id: 'sql', title: 'SQL', category: 'Databases',
    description: 'Joins, indexes, transactions — reading and shaping relational data.',
    prerequisites: ['Programming Fundamentals'], practice: 'JOIN three tables; EXPLAIN a slow query.', project: 'Schema + seed data for the TODO API.',
  },
  {
    id: 'postgres', title: 'PostgreSQL', category: 'Databases',
    description: 'Production-grade relational database: roles, backups, constraints.',
    prerequisites: ['SQL'], practice: 'Create roles, run pg_dump restores, add constraints.', project: 'Back the TODO API with PostgreSQL in Docker.',
  },
  {
    id: 'redis', title: 'Redis & Caching', category: 'Databases',
    description: 'In-memory store for sessions, rate limits and cache-aside patterns.',
    prerequisites: ['PostgreSQL'], practice: 'Cache an endpoint; set TTLs; inspect eviction.', project: 'Add response caching + rate limiting to your API.',
  },
  {
    id: 'jwt', title: 'Authentication (JWT)', category: 'Security',
    description: 'Passwords (hashing), sessions vs tokens, and safe JWT handling.',
    prerequisites: ['Express.js', 'PostgreSQL'], practice: 'Hash with bcrypt; rotate secrets; expire tokens.', project: 'Login, registration and protected routes.',
  },
  {
    id: 'security', title: 'Web Security Basics', category: 'Security',
    description: 'OWASP Top 10 essentials: injection, XSS, CSRF, secrets handling.',
    prerequisites: ['Authentication (JWT)'], practice: 'Break then fix a deliberately vulnerable form.', project: 'Security checklist audit of your own API.',
  },
  {
    id: 'testing', title: 'Testing', category: 'Quality',
    description: 'Unit, integration and endpoint tests that let you refactor fearlessly.',
    prerequisites: ['Express.js'], practice: 'Cover one route with success + failure cases.', project: 'CI gate that blocks merges on failing tests.',
  },
  {
    id: 'docker', title: 'Docker', category: 'DevOps',
    description: 'Images, containers, volumes, Compose — reproducible environments.',
    prerequisites: ['Linux Basics'], practice: 'Dockerise the API + database with Compose.', project: 'One-command `docker compose up` for the whole stack.',
  },
  {
    id: 'nginx', title: 'NGINX', category: 'DevOps',
    description: 'Reverse proxy, TLS termination, static files and load balancing.',
    prerequisites: ['Docker', 'HTTP'], practice: 'Proxy two backends; add a self-signed cert.', project: 'NGINX in front of your API with HTTPS redirect.',
  },
  {
    id: 'cicd', title: 'CI/CD', category: 'DevOps',
    description: 'Automated test → build → deploy pipelines on every push.',
    prerequisites: ['Testing', 'Docker', 'Git & GitHub'], practice: 'Lint + test workflow on pull requests.', project: 'Auto-deploy the API to a VPS on main-branch push.',
  },
  {
    id: 'cloud', title: 'Cloud (AWS)', category: 'DevOps',
    description: 'EC2/RDS/S3 basics, IAM least privilege, and reading the bill.',
    prerequisites: ['NGINX', 'PostgreSQL'], practice: 'Launch, secure and destroy a throwaway instance.', project: 'Move the stack to managed database + object storage.',
  },
  {
    id: 'monitoring', title: 'Monitoring & Logging', category: 'Quality',
    description: 'Structured logs, metrics, alerts — knowing before users tell you.',
    prerequisites: ['Cloud (AWS)'], practice: 'Add request IDs and a /health endpoint.', project: 'Dashboard + alert for error-rate spikes.',
  },
  {
    id: 'system-design', title: 'System Design', category: 'Architecture',
    description: 'Scaling reads/writes, queues, caches, and trade-off reasoning.',
    prerequisites: ['Redis & Caching', 'PostgreSQL'], practice: 'Design URL-shortener and rate-limiter on paper.', project: 'Architecture doc for scaling your API to 10k rps.',
  },
  {
    id: 'microservices', title: 'Microservices', category: 'Architecture',
    description: 'When (and when not) to split: boundaries, contracts, failure modes.',
    prerequisites: ['System Design', 'Docker'], practice: 'Extract one service behind an internal API.', project: 'Post-mortem: monolith vs split for your own app.',
  },
];

const CATEGORIES = Array.from(new Set(ROADMAP_ITEMS.map((i) => i.category)));

interface StoredProgress {
  statuses: Partial<Record<string, SkillStatus>>;
  category: string;
}

const VALID_IDS = new Set(ROADMAP_ITEMS.map((i) => i.id));
const VALID_STATUS = new Set<SkillStatus>(['not-started', 'learning', 'practicing', 'completed']);

function loadProgress(): StoredProgress {
  const empty: StoredProgress = { statuses: {}, category: 'All' };
  if (typeof window === 'undefined') return empty;
  // Current format
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const p = parsed as Partial<StoredProgress>;
        const statuses: Partial<Record<string, SkillStatus>> = {};
        if (p.statuses && typeof p.statuses === 'object') {
          for (const [id, st] of Object.entries(p.statuses)) {
            if (VALID_IDS.has(id) && typeof st === 'string' && VALID_STATUS.has(st as SkillStatus)) {
              statuses[id] = st as SkillStatus;
            }
          }
        }
        const cats = new Set(['All', ...CATEGORIES]);
        return { statuses, category: typeof p.category === 'string' && cats.has(p.category) ? p.category : 'All' };
      }
    }
  } catch {
    // fall through to legacy / empty
  }
  // Migrate legacy v1 (string[] of completed ids)
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const statuses: Partial<Record<string, SkillStatus>> = {};
        for (const id of parsed) {
          if (typeof id === 'string' && VALID_IDS.has(id)) statuses[id] = 'completed';
        }
        return { statuses, category: 'All' };
      }
    }
  } catch {
    // corrupted storage → start fresh
  }
  return empty;
}

export default function Roadmap() {
  const [statuses, setStatuses] = useState<Partial<Record<string, SkillStatus>>>({});
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState('All');
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const stored = loadProgress();
    setStatuses(stored.statuses);
    setCategory(stored.category);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: StoredProgress = { statuses, category };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Private-mode storage may throw — progress simply won't persist.
    }
  }, [statuses, category, hydrated]);

  const statusOf = (id: string): SkillStatus => statuses[id] ?? 'not-started';

  const doneSet = useMemo(() => new Set(Object.entries(statuses).filter(([, s]) => s === 'completed').map(([id]) => id)), [statuses]);
  const activeCount = useMemo(
    () => Object.values(statuses).filter((s) => s === 'learning' || s === 'practicing').length,
    [statuses]
  );
  const visible = useMemo(
    () => (category === 'All' ? ROADMAP_ITEMS : ROADMAP_ITEMS.filter((i) => i.category === category)),
    [category]
  );
  const pct = Math.round((doneSet.size / ROADMAP_ITEMS.length) * 100);
  const categoryStats = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const items = ROADMAP_ITEMS.filter((i) => i.category === c);
        const done = items.filter((i) => doneSet.has(i.id)).length;
        return { name: c, total: items.length, done, pct: Math.round((done / items.length) * 100) };
      }),
    [doneSet]
  );

  const cycle = (id: string) => {
    setConfirmReset(false);
    setStatuses((prev) => {
      const next = { ...prev };
      const following = NEXT_STATUS[(prev[id] ?? 'not-started') as SkillStatus];
      if (following === 'not-started') delete next[id];
      else next[id] = following;
      return next;
    });
  };

  const resetAll = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setStatuses({});
    setConfirmReset(false);
  };

  return (
    <>
      <Head>
        <title>Backend Roadmap Tracker | Win vs Linux Academy</title>
        <meta name="description" content="Track your backend developer journey — progress persists in your browser." />
      </Head>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <LabHeader
          icon={<FaRoad className="text-green-500" />}
          title="Backend Development Roadmap"
          description="From programming fundamentals to microservices. Check items off as you learn — your progress is saved in this browser."
          topic="Career Path"
          difficulty="All levels"
          timeEstimate="Self-paced"
          tryList={[
            'Filter by category, expand an item, and do its “practice” task.',
            'Your checkmarks survive reloads — they live in localStorage, no account needed.',
          ]}
        />

        {/* Progress */}
        <GlassCard className="border-2 border-primary/20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold" aria-live="polite">
              Overall progress: <span className="text-primary">{hydrated ? `${pct}%` : '…'}</span>{' '}
              <span className="text-sm font-normal text-muted-foreground">
                ({doneSet.size} / {ROADMAP_ITEMS.length} completed
                {activeCount > 0 ? ` · ${activeCount} in progress` : ''})
              </span>
            </p>
            <button
              onClick={resetAll}
              className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-2 ${
                confirmReset ? 'bg-red-600 text-white' : 'glass hover:bg-red-500/10 hover:text-red-500'
              }`}
              aria-label={confirmReset ? 'Click again to confirm resetting all progress' : 'Reset all progress'}
            >
              <FaUndo aria-hidden="true" />
              {confirmReset ? 'Click again to confirm reset' : 'Reset progress'}
            </button>
          </div>
          <div
            className="mt-2 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
            role="progressbar"
            aria-valuenow={hydrated ? pct : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall roadmap progress"
          >
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${hydrated ? pct : 0}%` }} />
          </div>
          {/* Category progress */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categoryStats.map((c) => (
              <div key={c.name} className="p-2 glass rounded-xl">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <CategoryIcon category={c.name} className="text-primary" />
                    {c.name}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {c.done}/{c.total}
                  </span>
                </div>
                <div
                  className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={c.pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${c.name} progress`}
                >
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
            {['All', ...CATEGORIES].map((c) => {
              const total = c === 'All' ? ROADMAP_ITEMS.length : ROADMAP_ITEMS.filter((i) => i.category === c).length;
              const done =
                c === 'All' ? doneSet.size : ROADMAP_ITEMS.filter((i) => i.category === c && doneSet.has(i.id)).length;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs transition flex items-center gap-1.5 ${
                    category === c ? 'bg-primary text-white' : 'glass hover:bg-primary/10'
                  }`}
                >
                  {c !== 'All' && <CategoryIcon category={c} />}
                  {c} ({done}/{total})
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Items */}
        <div className="space-y-3">
          {visible.map((item, idx) => {
            const status = statusOf(item.id);
            const done = status === 'completed';
            const meta = STATUSES.find((s) => s.id === status) ?? STATUSES[0];
            return (
              <GlassCard key={item.id} className={done ? 'border-green-500/40' : ''}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-mono text-muted-foreground">{category === 'All' ? `${idx + 1}.` : ''}</span>
                      <h2 className={`font-bold ${done ? 'line-through text-muted-foreground' : ''}`}>{item.title}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        <CategoryIcon category={item.category} />
                        {item.category}
                      </span>
                      <button
                        onClick={() => cycle(item.id)}
                        aria-label={`${item.title}: ${meta.label}. Activate to advance status.`}
                        title="Advance status: Not started → Learning → Practicing → Completed"
                        className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition ${meta.badge}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                        {meta.label}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                    <details className="mt-1 text-sm">
                      <summary className="cursor-pointer text-primary hover:underline text-xs">
                        Why learn this? Prerequisites · Practice · Project
                      </summary>
                      <dl className="mt-2 space-y-1.5 text-xs">
                        <div className="p-2 glass rounded-lg">
                          <dt className="font-semibold">Why learn this?</dt>
                          <dd className="text-muted-foreground">{item.description}</dd>
                        </div>
                        <div className="p-2 glass rounded-lg">
                          <dt className="font-semibold">Prerequisites</dt>
                          <dd className="text-muted-foreground">
                            {item.prerequisites.length > 0 ? item.prerequisites.join(' · ') : 'None — start here.'}
                          </dd>
                        </div>
                        <div className="p-2 glass rounded-lg">
                          <dt className="font-semibold">What to practice</dt>
                          <dd className="text-muted-foreground">{item.practice}</dd>
                        </div>
                        <div className="p-2 glass rounded-lg">
                          <dt className="font-semibold">Recommended project</dt>
                          <dd className="text-muted-foreground">{item.project}</dd>
                        </div>
                      </dl>
                    </details>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Progress is stored only in this browser (localStorage key <code className="font-mono">{STORAGE_KEY}</code>). No
          account, no server.
        </p>
      </motion.div>
    </>
  );
}
