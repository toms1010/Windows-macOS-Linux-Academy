# Database (usage)

Postgres via Supabase; SQL in `supabase/migrations/`. Tables: `profiles`,
`contact_messages`, `quiz_questions`, `quiz_attempts`, `quiz_answers`
(see `../database/schema.md`, `tables.md`). RLS on all user tables
(see `../database/rls-policies.md`); no `using (true)` on user data.

Access paths (never direct client queries from pages, except via services):
- Profiles: `auth.service.getProfileName/saveProfileName`.
- Contact: `POST /api/contact` → SQLite + mirror insert to
  `contact_messages` (anon key, RLS insert policy).
- Quiz: `result.service.saveAttempt` → `quiz_attempts` + `quiz_answers`
  (own-rows RLS); `question.service` reads the local bank (no DB reads yet).
- Health: `GET /api/health` → `{status:'ok',db:'up'|'down'}` (boolean only).

`src/types/database.types.ts` exposes `Database["public"]["Tables"]…`
`Row`/`Insert`/`Update` shapes for services. Local contact SQLite schema
(`contact_messages`: id, name, email, feedback, status, created_at,
updated_at) is created idempotently by `src/lib/db.ts`.
