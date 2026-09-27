# Windows vs Linux Academy

Interactive educational web app for Computer Engineering, Computer Science and IT
students — OS concepts (kernels, privilege rings, paging, scheduling) plus hands-on
CLI practice and a backend developer roadmap.

## Stack

Next.js 14 (Pages Router) · React 18 · TypeScript · Tailwind CSS ·
Framer Motion · React Icons · Chart.js / react-chartjs-2 · next-themes

## Run it

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (next/core-web-vitals)
npx tsc --noEmit # type check
```

## Interactive OS Laboratories

All labs share `GlassCard`, `CodeBlock` and the `LabHeader` component
(`src/components/labs/`), support light/dark mode, keyboard navigation and
mobile layouts, and are **pure simulations — nothing executes on the host**.

| Lab | Route | What it teaches | State / persistence |
| --- | --- | --- | --- |
| Permissions Lab | `/permissions` | chmod calculator, symbolic mode, setuid/setgid/sticky, chown preview, POSIX ACL calculator (mask/default), umask for files vs dirs | Local component state, Reset buttons |
| CPU Scheduling | `/cpu-scheduling` | FCFS / SJF / SRTF / Round Robin, animated CPU box, Gantt chart with idle/CS segments, PCB states, ready queue, configurable context-switch cost, CT/TAT/WT/RT, per-decision explanations | Deterministic from inputs; Play/Pause/Step/Reset |
| Virtual Memory | `/virtual-memory` | Pages, frames, TLB vs page table vs faults, FIFO/LRU/Optimal, Belady anomaly check | Deterministic trace from reference string; Step/Reset |
| Filesystem Explorer | `/filesystem-explorer` | Collapsible Linux/Windows trees (+Registry as database), node search, cross-OS concept chips, mobile OS tabs, mode bits vs ACLs (not equivalent) | Expanded nodes + selection per pane |
| System Calls | `/system-calls` | strace-style traces for `cat`/`echo`/`ls`; Ring 3 → Ring 0 animation for read/write/fork/chmod | Playback controls, clickable steps |
| Debugging Scenarios | `/terminal-simulator` (bottom) | Fix permission-denied, crashed-service logs, disk-full via `ls`/`cat`/`chmod`/`grep`/`rm` | Per-scenario terminal, hint toggle, reset |
| Roadmap Tracker | `/roadmap` | 22 backend topics with why / prerequisites / practice / project; 4-state skill status, category progress bars | `localStorage` (`wla-roadmap-progress-v2`, migrates v1), two-step reset |

Traces and schedules are labelled as educational simulations: real syscall
sequences and scheduler behavior vary by kernel, libc, architecture and load.

## Project structure

```text
src/
├── components/
│   ├── common/   # Layout, Navbar, Sidebar, SearchBar, ThemeToggle, …
│   ├── labs/     # Interactive OS Lab modules + LabHeader
│   ├── pages/    # Static educational visuals (Timeline, KernelDiagram, …)
│   └── ui/       # GlassCard, CodeBlock, InteractiveTable
├── pages/        # One file per route (Pages Router)
└── styles/       # globals.css (glass utilities, theme tokens)
```

## Testing the labs

1. `npx tsc --noEmit` and `npm run lint` — must be clean.
2. `npm run build` — all routes must prerender.
3. Open each lab: Play/Step/Reset, invalid input (e.g. bad reference string,
   out-of-range burst, malformed `u+` clause), empty states, light + dark mode,
   mobile width (panels stack, tables/Gantt scroll horizontally).
4. Roadmap: check items, reload (progress persists), two-step reset clears it.

## Backend & contact feedback

Real end-to-end flow: `ContactForm` → `POST /api/contact` → validation →
SQLite → success response. No ORM, no new dependencies (Node built-in
`node:sqlite`).

- `src/pages/api/contact.ts` — accepts JSON, validates + sanitizes, 10/min/IP
  rate limit (429), idempotent retries via 60s duplicate guard, parameterized
  queries only, generic 500s (no leaks). Method-guarded (405 otherwise).
- `src/pages/api/health.ts` — `{status:'ok',db:'up'|'down'}`, no internals.
- `src/lib/db.ts` — singleton connection, auto-creates `data/contact.db`
  (override with `CONTACT_DB_PATH`) and the `contact_messages`
  table (`id, name, email, feedback, status NEW|READ|ARCHIVED, createdAt, updatedAt`).
- `src/lib/validation.ts` — shared client/server rules (name 2–100, email
  format ≤254, feedback 10–5000).
- `.env.example` documents `CONTACT_DB_PATH`; `.gitignore` excludes
  `.env*` and `data/`. Contact messages are never added to `/search`.
- No auth/admin area exists in this project, so message management is
  intentionally **not** exposed — backend first, admin requires future auth.

## Backend & auth

- Contact feedback: `ContactForm` → `POST /api/contact` → validation → SQLite
  (`data/contact.db`, `CONTACT_DB_PATH`), mirrored best-effort to Supabase
  `contact_messages` when configured.
- Supabase (optional, needs project credentials): `src/lib/supabase.ts`
  (anon key only, graceful when unconfigured), `AuthProvider` session handling,
  `/login`, `/signup`, `/forgot-password`, `/update-password`, guarded
  `/profile` with `profiles` table read/write. SQL in `supabase/migrations/`
  (profiles, contact_messages, ownership-only RLS). Set
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable;
  without them auth pages explain setup and the contact form keeps working
  on the local backend.

## Architecture (data flow: Pages → Components → Hooks → Services → Supabase)

- `src/features/auth/` — `auth.service.ts` (sign in/up/out, reset, profile),
  `auth.types.ts`, `useAuth.tsx` (sole provider + hook)
- `src/features/questions/` — `question.service.ts` (bank + local/AI generation),
  `question.types.ts`, `question.validation.ts`
- `src/features/quiz/` — `quiz.service.ts` (pure scoring), `quiz.types.ts`
- `src/features/results/` — `result.service.ts` (attempt/answer writes),
  `result.types.ts`, `useResults.ts` (save-once hook)
- `src/lib/` — infra only: `supabase.ts` (single client), `env.ts`,
  `constants.ts`, `db.ts`, `rateLimit.ts`
- `src/validation/contact.ts`, `src/utils/errors.ts` (central error mapping),
  `src/types/database.types.ts` (mirror of migrations until `supabase gen types`)
- Quiz: one-question flow with explanations, results + review, and a
  generator with explicit ⚡ Local (curated bank, offline) vs ✨ AI modes —
  AI has no provider wired, so it honestly reports unconfigured and offers
  local fallback (never auto-switches, never mislabels). Sources shown on
  results (📝/⚡/✨). Attempts persist via `services/quizAttempts.ts` when
  signed in + configured (`generation_mode` recorded); migrations 004–005.

## Known limitations

- Simulations are simplified models (e.g. TLB uses FIFO replacement; syscall
  traces are representative, not kernel-exact).
- No test suite exists yet (no unit/integration/e2e).
- Roadmap progress is per-browser localStorage; no accounts or sync.

## Original visual references

The three standalone HTML prototypes these labs were converted from are
archived under `docs/originals/` (`cpu-scheduling-`, `virtual-memory-`,
`filesystem-original.html`). They are reference only — the React labs above
are the maintained implementations.
