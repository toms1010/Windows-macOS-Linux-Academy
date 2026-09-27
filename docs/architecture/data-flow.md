# Data Flow

## Quiz (answer → score → persist)

```text
QuizPage
 ↓
question.service.ts   (bank: generateLocal / countAvailable / shuffleOptions)
 ↓
quiz.service.ts       (pure: calculateScore / percentageOf / deriveGenerationMode)
 ↓
useResults            (save-once-per-run hook)
 ↓
result.service.ts     (saveAttempt → quiz_attempts, then quiz_answers)
 ↓
supabase.ts           (single client)
 ↓
PostgreSQL (RLS: own rows only)
```

## Auth

```text
login/signup/forgot/update-password pages
 ↓
auth.service.ts       (signIn/signUp/signOut/reset/update/profile I/O)
 ↓
supabase.ts
 ↓
Supabase Auth ──→ useAuth context (session restore + SIGNED_IN/OUT/REFRESHED/UPDATED)
 ↓
AuthGuard → protected pages (/profile)
```

## Contact (dual store)

```text
ContactForm (client validation, shared rules)
 ↓ POST /api/contact
validation/contact.ts (server re-validates: name 2–100, email ≤254, feedback 10–5000)
 ↓
SQLite (data/contact.db) — reliable record  ┬  Supabase contact_messages (best-effort mirror)
rate limit 10/min/IP · 60s duplicate guard   ┘  anon-key insert, RLS enforced
 ↓
201 { success: true }  (400 validation / 405 method / 429 limit / 500 generic)
```

## AI generation (planned, NOT implemented)

```text
GeneratorPanel (mode=ai)
 ↓
question.service.requestAI  →  currently returns { ok:false, reason:'not-configured' }
 ↓ (future)
Supabase Edge Function (secret key server-side)
 ↓
AI Provider → validateQuestion() + duplicate checks → preview
```

The UI never auto-switches modes and never labels bank questions as AI.
