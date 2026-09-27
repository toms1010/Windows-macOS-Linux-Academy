# Security

- **Keys:** anon key only in `NEXT_PUBLIC_*` vars; service-role key banned
  from the repo (none present — verified). `.env*` and `data/` gitignored.
- **RLS:** enabled on `profiles`, `contact_messages`, `quiz_questions`,
  `quiz_attempts`, `quiz_answers`; ownership via `auth.uid() = …`. Full
  matrix in `../database/rls-policies.md`.
- **Auth:** Supabase Auth only — no custom password storage. Friendly errors;
  no tokens/SQL/stack traces in UI or API responses (API returns generic
  400/405/429/500 JSON).
- **Input:** server re-validates everything (`validation/contact.ts`,
  `features/questions/question.validation.ts`); control chars stripped;
  length caps (feedback ≤5000); all SQL parameterized (`node:sqlite`) or via
  PostgREST; rate limit 10/min/IP + 60s duplicate guard on contact.
- **Routes:** `/profile` behind `AuthGuard`; anon users can only INSERT
  contact/own quiz rows per RLS — no update/delete policies for clients.
- **AI:** no provider, keys, or network calls exist; the stub cannot leak
  what does not exist.
