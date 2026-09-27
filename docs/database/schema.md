# Database Schema

Source of truth: `supabase/migrations/001–005` (not yet applied anywhere —
no Supabase project exists). All tables use UUID PKs and
`created_at/updated_at timestamptz default now()` (auto-touched via
`touch_updated_at()` trigger, except quiz tables which are append-only).

```text
auth.users (Supabase-managed)
 ├── profiles (id PK/FK → auth.users.id, cascade)
 ├── contact_messages (user_id FK → auth.users.id, set null; nullable = anonymous)
 ├── quiz_attempts (user_id FK → auth.users.id, cascade)
 │    └── quiz_answers (attempt_id FK → quiz_attempts.id, cascade)
 └── quiz_questions (created_by FK → auth.users.id, set null; null = curated)
```

`quiz_questions.options` is `jsonb`. See `tables.md` for columns,
`rls-policies.md` for access rules.
