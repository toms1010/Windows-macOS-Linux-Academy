# Win vs Linux Academy

Interactive educational web app for Computer Engineering, Computer Science, and IT
students — OS concepts (kernels, privilege rings, paging, scheduling) taught through
hands-on labs: CLI practice, CPU/memory/filesystem simulators, quizzes with question
generation, comparisons, and a backend developer roadmap.

Live: **https://windows-linux-academy.vercel.app**

## Quick Start

```bash
git clone https://github.com/toms1010/Windows-macOS-Linux-Academy.git
cd windows-linux-academy   # or the checkout directory name
npm install
cp .env.example .env   # optional until Supabase is used (see Environment Variables)
npm run dev            # http://localhost:3000
```

## Overview

- **Learn:** OS fundamentals, Windows/Linux/macOS comparisons, kernel types and
  architecture, evolution timelines, Ubuntu server administration.
- **Practice:** Linux terminal simulator, guided debugging scenarios, command
  reference, interactive quiz.
- **Simulate:** CPU scheduling (FCFS/SJF/SRTF/Round Robin), virtual memory
  (FIFO/LRU/Optimal, TLB, Belady check), filesystem explorer, system-call tracer,
  permissions lab (chmod/ACL/umask).
- **Track:** backend roadmap with per-skill status and localStorage persistence;
  authenticated users can save quiz attempts and manage a profile.

## Features

- 30+ content pages, 7 interactive labs, quiz engine with review + retry.
- Question generator: explicit ⚡ Local (curated bank, offline) vs ✨ AI modes —
  AI has no provider wired and reports itself unconfigured (never mislabeled).
- Contact/feedback form with real backend persistence.
- Supabase Auth (optional): login, signup, email verification, password reset,
  guarded profile page.
- Site search (`/search?q=…`), dark/light theme, mobile drawer navigation.

## Tech Stack

Actual dependencies from `package.json` — nothing else is used:

- Frontend: Next.js 14 (Pages Router), React 18, TypeScript, Tailwind CSS,
  Framer Motion, React Icons, Chart.js / react-chartjs-2, next-themes.
- Backend: Next.js API routes (`src/pages/api/`), Supabase JS v2
  (`@supabase/supabase-js`), Node built-in `node:sqlite` (contact fallback).
- Database: Supabase PostgreSQL (optional) + local SQLite (`data/contact.db`).
- Auth: Supabase Auth. Deployment: Vercel.

## Project Structure

```text
src/
├── pages/            # one file per route (+ pages/api/contact.ts, health.ts)
├── components/       # common/ (Layout, Navbar, Sidebar, Footer…), ui/,
│                     # labs/ (lab modules), auth/, quiz/, contact/, pages/
├── features/         # single service layer: auth/, questions/, quiz/, results/
├── lib/              # infra only: supabase.ts, env.ts, constants.ts, db.ts, rateLimit.ts
├── types/            # database.types.ts (hand mirror), contact.ts
├── validation/       # contact.ts (shared client/server rules)
├── utils/            # errors.ts (central error mapping)
├── data/             # quizBank.ts (curated questions)
└── styles/           # globals.css
supabase/migrations/  # 001_profiles … 005_quiz_source_columns (.sql)
docs/                 # architecture/, backend/, database/ deep-dives + originals/
```

Responsibilities: Pages compose → Components present → Hooks hold feature state →
Feature Services access data → `lib/supabase.ts` (sole client). Details in
`docs/architecture/`.

## Requirements

- Node.js **>= 22** (`engines` in `package.json`; needed for `node:sqlite`).
  Verified with Node v24 / npm 11.
- npm (lockfile: `package-lock.json`), Git.
- No Docker, Supabase CLI, or extra services required for local use.

## Installation

```bash
git clone https://github.com/toms1010/Windows-macOS-Linux-Academy.git
cd windows-linux-academy
npm install
```

If `npm install` fails: delete `node_modules` + `package-lock.json` and retry;
ensure Node >= 22 (`node --version`). Never commit dependency workarounds.

## Environment Variables

Only these are read (see `src/lib/env.ts`, `.env.example`). Copy the example file
and fill values only when using Supabase; the app runs without them (auth shows a
setup notice, contact uses SQLite).

```env
CONTACT_DB_PATH=./data/contact.db
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Rules: frontend uses the **anon key only** — never put a service-role key in code,
`.env.example`, or git. `.env*` and `data/` are gitignored. (Framework is Next.js,
so `NEXT_PUBLIC_*`, not `VITE_*`.)

## Frontend Setup

```bash
npm run dev     # http://localhost:3000
```

Single terminal is enough (frontend + API routes run in the same Next.js server).

## Backend Setup

Architecture: browser → Next.js API routes → SQLite (+ best-effort Supabase
mirror); browser → Supabase Auth/PostgREST directly when configured.

1. `npm install`, optional `.env` (see above).
2. `npm run dev` — API live at `http://localhost:3000/api/*`.
3. Contact writes `./data/contact.db` (auto-created); override with `CONTACT_DB_PATH`.
   On Vercel the path falls back to `/tmp` (ephemeral — use Supabase for durable prod data).

## Database Setup

Without Supabase, nothing to do (SQLite auto-creates schema on first write).
With Supabase:

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/migrations/` **in order** 001 → 005
   (profiles, contact_messages, RLS, quiz tables, source columns).
3. Confirm RLS is enabled (the migrations do it; never disable RLS to debug —
   fix the policy instead).
4. Set the two env vars, restart.

## Supabase Setup

Project URL + anon key from the Supabase dashboard → `.env` as above → restart.
No seed data required; `profiles` rows are created on first save.

## Local Development

```bash
npm run dev     # develop (http://localhost:3000)
npm run build   # verify production build (37 static pages)
npm start       # serve the production build locally
npm run lint    # ESLint (next/core-web-vitals)
npx tsc --noEmit # type check
```

Available scripts are exactly: `dev`, `build`, `start`, `lint` (plus `npx tsc --noEmit`).

## How to Run

New developer, copy-paste: clone → `npm install` → `cp .env.example .env` (optional) →
`npm run dev` → open http://localhost:3000. Supabase/DB steps above only if needed.

## Available Routes

Pages (`src/pages/`, verified): `/`, `/os`, `/os-overview`, `/comparison`,
`/os-comparison`, `/triple-comparison`, `/windows`, `/linux`, `/evolution`,
`/history`, `/kernel`, `/kernel-types`, `/linux-architecture`,
`/windows-architecture`, `/commands`, `/terminal-simulator`, `/quiz`,
`/learning-hub`, `/roadmap`, `/projects`, `/ubuntu-guide`,
`/resources`, `/search`, `/contact`, `/login`, `/signup`, `/forgot-password`,
`/update-password`, `/profile` (guarded), `/permissions`, `/cpu-scheduling`,
`/virtual-memory`, `/filesystem-explorer`, `/system-calls`, plus `404`.

## API

`POST /api/contact` — JSON `{name, email, feedback}` → `201 {success, message}`
(or `deduped:true` for 60s-identical retries). Errors: `400` field errors,
`405` non-POST, `429` (>10/min/IP), `500` generic. Never leaks internals.

`GET /api/health` → `{status:'ok', db:'up'|'down'}` (boolean only).

## Database Schema

- `profiles`: `id` uuid PK → `auth.users` (cascade), `full_name`, `avatar_url`,
  timestamps. RLS: own-row insert/select/update.
- `contact_messages`: uuid PK, nullable `user_id` → auth.users (set null),
  `name` 1–100, `email` 3–254, `message` 1–5000, `status` NEW/READ/ARCHIVED,
  timestamps, indexes on `created_at`, `user_id`. RLS: anon/authenticated INSERT,
  own-row SELECT, no client update/delete.
- `quiz_questions`: uuid PK, `quiz_id`, `topic`, `question`, type/difficulty
  checks, `options` jsonb, `correct_answer`, `explanation`, `hint`,
  `source` local/ai/author, nullable `created_by`. RLS: curated rows public,
  private rows owner-only; authenticated INSERT own rows.
- `quiz_attempts`: uuid PK, `user_id` → auth.users (cascade), `quiz_id`,
  `score`, `total_questions`, `percentage`, `generation_mode`, timestamps.
  RLS: own rows ALL.
- `quiz_answers`: uuid PK → attempts (cascade), `question_id`,
  `selected_answer`, `is_correct`. RLS: via own attempt.
- Full DDL: `supabase/migrations/001–005`; column detail: `docs/database/tables.md`.

## Authentication

Supabase email/password via `features/auth/auth.service.ts`; session restore +
`SIGNED_IN/SIGNED_OUT/TOKEN_REFRESHED/USER_UPDATED` in `useAuth`;
`AuthGuard` redirects logged-out users to `/login?next=…`; login bounces signed-in
users to profile. Friendly errors only, neutral reset wording (no enumeration).
Without env vars, auth pages explain setup and everything else keeps working.

## Testing

```bash
npx tsc --noEmit   # must be clean
npm run lint       # must report no warnings/errors
npm run build      # all 37 pages must prerender
```

Then boot (`npm start` or `dev`) and smoke-test: contact valid/invalid/long/double
submit, quiz answer→results→retry→generate, roadmap check+reload, labs Play/Reset
with invalid input, `/api/health`. No unit/e2e suite exists.

## Mobile Responsive Testing

Hamburger (44px, `aria-expanded`/`aria-controls`) opens the full drawer (overlay,
Esc, scroll-lock, active route) below `lg`; desktop nav untouched. Verify
320/360/375/390/414/430px: header fits, menu opens/closes/navigates, no page-level
horizontal scroll (tables/code/Gantt scroll inside their containers), forms full
width, Back/Forward keeps active state. Checklist: `CHANGELOG.md` mobile entry.

## Build

```bash
npm run build   # outputs .next/ (37 static pages + dynamic API)
npm start       # serves it
```

## Production Deployment

Live on **Vercel** (`https://windows-linux-academy.vercel.app`), deployed via CLI;
`engines.node >= 22` is required (Vercel default 20 breaks `node:sqlite`).
Optional Vercel env vars: the two Supabase keys. Do not deploy from this docs task;
see `git log` for history.

## Troubleshooting

- **Blank `MODULE_NOT_FOUND vendor-chunks` / webpack pack rename errors in dev:**
  stale `.next` (often two dev servers sharing it). Stop servers, `rm -rf .next`,
  restart one server.
- **`tsconfig` ES5/node10 deprecation errors:** already fixed (`ES2017`, `bundler`).
- **Port in use:** `lsof -ti:3000 | xargs kill`, then `npm run dev`.
- **Contact 429:** rate limit tripped during testing — wait a minute.
- **Auth pages show setup notice:** Supabase env vars missing — expected without them.
- **Build fails on `node:sqlite` types:** `@types/node` predates it; `src/types/node-sqlite.d.ts` covers it.

## Security

Anon key only client-side; RLS ownership-only everywhere; server re-validates all
input; parameterized queries; rate limiting + dedup guard; generic error JSON;
contact data excluded from `/search`; `.env*`/`data/` gitignored. Details:
`docs/backend/security.md`.

## Development Workflow

Inspect → change (single service layer, feature-collocated) → typecheck/lint/build →
update affected `docs/` + `CHANGELOG.md` → verify docs match code. Debt register:
`docs/architecture/tech-debt.md` (TD-1/2/3 open).

## Architecture

Pages → Components → Hooks → Feature Services → Supabase/SQLite. Single client,
single env module, central error mapping. Maps: `docs/architecture/`.

## Contributing

Keep changes scoped; reuse `GlassCard`/`CodeBlock`/`LabHeader`; simulations stay
client-side and side-effect free; never add secrets, duplicate layers, or
unverified claims. Run the Testing trio before opening changes.

## License

No license file is present in the repository. All rights reserved by default —
add one if open-sourcing is intended.
