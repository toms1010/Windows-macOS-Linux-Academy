# Supabase Backend

- **Client:** `src/lib/supabase.ts` — the ONLY `createClient` call in the repo.
  Lazy singleton; returns `null` when env is absent.
- **Env:** `src/lib/env.ts` (`env.supabaseUrl`, `env.supabaseAnonKey`,
  `isSupabaseConfigured()`). Variables: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`). Anon key only —
  the service-role key must never enter this repo.
- **Types:** `src/types/database.types.ts` hand-mirrors `supabase/migrations/`;
  replace with `supabase gen types typescript` output once a project exists.
- **Migrations:** `supabase/migrations/001–005` (profiles, contact_messages,
  RLS, quiz tables, source columns). Safe/repeatable (`IF NOT EXISTS`,
  drop-then-create policies). Not yet applied anywhere (no project).
- **Local SQLite** (`src/lib/db.ts`, `CONTACT_DB_PATH`, default
  `./data/contact.db`) remains the reliable contact store; Supabase is a
  best-effort mirror until credentials make it primary.
- No Edge Functions exist yet (see `ai-generation.md`).
