# Services (single layer — one per domain)

## features/auth/auth.service.ts
`signUp`, `signIn`, `signOut`, `getSessionUser`, `sendPasswordReset`,
`updatePassword`, `getProfileName`, `saveProfileName`.

## features/questions/question.service.ts
`topics()`, `countAvailable()`, `generateLocal()` (validated, deduped,
rotating), `requestAI()` (explicit unconfigured stub), `shuffleOptions()`;
constants `MAX_GENERATE` (20), `COUNT_OPTIONS`.

## features/quiz/quiz.service.ts (pure, no I/O)
`calculateScore(questions, answers)`, `percentageOf(score, total)`,
`deriveGenerationMode(questions)` → `local`/`ai`/`mixed`.

## features/results/result.service.ts
`saveAttempt(input)` → inserts `quiz_attempts`, then `quiz_answers`.
Consumed only via `useResults()` (save-once-per-run).

Removed (consolidated): top-level `services/quizGenerator.ts`,
`services/quizAttempts.ts`. Do not reintroduce parallel layers — extend the
feature service instead.
