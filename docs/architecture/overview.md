# Architecture Overview

Win vs Linux Academy is a Next.js 14 Pages Router app (React 18, TypeScript,
Tailwind, Framer Motion). Interactive OS labs run fully client-side;
persistence uses Supabase Postgres when configured, with a local SQLite
fallback for the contact form.

## Layers and responsibilities

| Layer | Location | Responsibility |
|---|---|---|
| Pages | `src/pages/` | Route-level composition only (incl. `pages/api/` server routes) |
| Components | `src/components/` | Presentation only (`ui/`, `auth/`, `quiz/`, `contact/`, `common/`, `pages/`) |
| Hooks | `src/features/*/use*.ts(x)` | Feature React state (`useAuth`, `useResults`); no DB clients |
| Feature services | `src/features/*/​*.service.ts` | Single data-access layer per domain |
| Lib | `src/lib/` | Infra/config only: Supabase singleton, env, constants, SQLite, rate limit |
| Types | `src/types/`, `src/features/*/​*.types.ts` | DB mirror + shared contracts; feature types live with features |
| Validation | `src/validation/`, `src/features/*/​*.validation.ts` | Input rules, shared client/server |
| Utils | `src/utils/` | Pure helpers (central error mapping) |
| Data | `src/data/` | Static curated content (question bank) |

## Dependency direction (strict)

```text
Pages
 ↓
Components
 ↓
Hooks
 ↓
Feature Services
 ↓
Lib / Supabase Client
 ↓
Supabase / PostgreSQL  (or local SQLite for contact)
```

Rules: services never import components/pages; only `src/lib/supabase.ts`
calls `createClient`; feature types are the single source of truth (no
duplicates in `src/types/`).

## Frontend/backend boundaries

- Browser → Supabase Auth + PostgREST (anon key, RLS-enforced).
- Browser → Next.js API routes (`pages/api/contact.ts`, `health.ts`) for the
  contact flow, which writes SQLite and best-effort mirrors to Supabase.
- No Edge Functions exist yet. AI generation has no provider wired; the stub
  lives in the question service and the UI reports it as unconfigured.

## Flows

- Auth: pages → `auth.service.ts` → Supabase Auth → `useAuth` context
  (`SIGNED_IN/SIGNED_OUT/TOKEN_REFRESHED/USER_UPDATED`).
- Quiz: page → `question.service.ts` (bank) → `quiz.service.ts` (pure scoring)
  → `useResults` → `result.service.ts` → `quiz_attempts`/`quiz_answers`.
- See `data-flow.md` for diagrams and `decisions.md` for why it looks this way.
