# Architecture Decision Records

Open debt and its resolution criteria live in `tech-debt.md` (TD-1/2/3 map
to ADRs 001/004/006 below). Close items only per the workflow there.

## ADR-001: Supabase as backend
- **Decision:** Supabase for Auth, Postgres, RLS; anon key in browser only.
- **Reason:** Managed auth + Postgres + RLS without operating servers.
- **Status:** Accepted (code-complete; live use needs project credentials).

## ADR-002: Feature-collocated single service layer
- **Decision:** One service per domain under `src/features/*/`; no top-level
  `services/`, `repositories/`, or `api/` folders.
- **Reason:** Prior refactor left overlapping layers; consolidation removed 7
  files with zero UI changes.
- **Status:** Accepted.

## ADR-003: Graceful degradation without Supabase env
- **Decision:** Missing env vars disable auth persistence; contact keeps
  working on SQLite; UI explains setup instead of crashing.
- **Reason:** Reliability first — the app must work with zero configuration.
- **Status:** Accepted.

## ADR-004: Pure quiz scoring
- **Decision:** `calculateScore`/`percentageOf` are pure functions in
  `features/quiz/quiz.service.ts`, separate from `result.service.ts`.
- **Reason:** Independently testable; DB failures can't corrupt scoring.
- **Status:** Accepted.

## ADR-005: No AI provider wired
- **Decision:** AI generation is an explicit unconfigured state, never a
  silent fallback; no secrets exist anywhere in the repo.
- **Reason:** Shipping a fake "AI" would misrepresent question provenance.
- **Status:** Accepted (revisit when an Edge Function + key exist).

## ADR-006: Local SQLite for contact (transitional)
- **Decision:** Keep `node:sqlite` (zero new deps) as the reliable contact
  store alongside the Supabase mirror.
- **Reason:** Works offline/without credentials; retire it once Supabase is
  the verified primary.
- **Status:** Accepted (transitional).
