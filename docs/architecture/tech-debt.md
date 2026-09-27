# Technical Debt Register

Temporary implementations are tracked here — never silently left. An item is
closed only after the implementation, verification, doc updates, and changelog
entry are all done. Workflow for every meaningful change: inspect → change →
test → update affected docs → update debt status → changelog → verify no drift.

## Technical Debt

- [ ] Replace manually maintained Supabase database types with generated types.
- [ ] Evaluate moving static quiz data into the question feature or Supabase.
- [ ] Retire SQLite after Supabase becomes the primary backend.

## TD-1 — Hand-mirrored Supabase database types (OPEN)
- **File:** `src/types/database.types.ts` (centralized; no duplicates exist)
- **State:** Temporary stand-in. Zero importers today — services will adopt
  these shapes after regeneration.
- **Resolution:** `npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts`,
  then `npx tsc --noEmit` + check `src/features/` consumers.
- **Docs on close:** `docs/backend/supabase.md`, `docs/backend/database.md`,
  `docs/database/schema.md`, `CHANGELOG.md`.

## TD-2 — Static quiz data outside `features/` (OPEN, accepted)
- **File:** `src/data/quizBank.ts` (note: briefs sometimes write
  `data/quizBank.ts`; the real path has the `src/` prefix).
- **State:** Intentional transitional placement. Data flows through
  `features/questions/question.service.ts`; `quiz.tsx` reads
  `INITIAL_QUESTIONS`/`QUIZ_TOPIC`, `GeneratorPanel` reads `BANK_TOPICS`.
- **Resolution options:** `features/questions/data/quizBank.ts`, or migrate
  into Supabase (`quiz_questions`) — then update the question service,
  delete this file only with zero dependents, never two sources of truth.
- **Docs on close:** `docs/architecture/folder-structure.md`,
  `docs/backend/services.md`, `docs/database/tables.md`, `CHANGELOG.md`.

## TD-3 — Temporary SQLite database (OPEN)
- **File:** `src/lib/db.ts` (`node:sqlite`, zero new deps). Consumers:
  `src/pages/api/contact.ts`, `src/pages/api/health.ts`. Do NOT add tables.
- **State:** Fallback until Supabase is verified primary (auth + DB + RLS +
  services). Current flow is UI → contact API → SQLite (+ best-effort mirror).
- **Resolution (in order):** verify Supabase → migrate consumers → remove
  `lib/db.ts` + config → typecheck/lint/build → verify flows manually.
- **Docs on close:** `docs/architecture/overview.md`, `data-flow.md`,
  `folder-structure.md`, `docs/backend/supabase.md`, `services.md`,
  `security.md`, `docs/database/schema.md`, `CHANGELOG.md`.

## Rules for future changes
1. Temporary stays must be documented (code header + here).
2. Closing an item requires: implementation, obsolete-code removal,
   typecheck/lint/build, doc updates, changelog entry — in that order.
3. Docs describe actual behavior only; mark Implemented / Planned /
   Deprecated / Removed explicitly. No `repositories/`, `controllers/`,
   duplicate service/hook layers, or duplicate type systems.
