# RLS Policies (from `003_rls_policies.sql` + quiz policies in `004`)

RLS is enabled on all five user tables. No `using (true)` on user data.

## profiles
- `profiles_insert_own` — INSERT, authenticated, `with check (auth.uid() = id)`
- `profiles_select_own` — SELECT, authenticated, `using (auth.uid() = id)`
- `profiles_update_own` — UPDATE, authenticated, using + with check `auth.uid() = id`
- No DELETE policy (account deletion cascades server-side via `auth.users`).

## contact_messages
- `contact_insert_any` — INSERT, `anon, authenticated`, `with check (true)`
  (the public feedback form must accept anonymous messages).
- `contact_select_own` — SELECT, authenticated, `using (auth.uid() = user_id)`.
- No update/delete for clients (moderation stays server-side).

## quiz_questions
- `quiz_questions_read` — SELECT, `anon, authenticated`,
  `using (created_by is null or auth.uid() = created_by)` (curated public, private own).
- `quiz_questions_insert_own` — INSERT, authenticated, `with check (auth.uid() = created_by)`.

## quiz_attempts
- `quiz_attempts_own` — ALL, authenticated, using + with check `auth.uid() = user_id`.

## quiz_answers
- `quiz_answers_via_attempt` — ALL, authenticated, using + with check
  `EXISTS (attempt … WHERE user_id = auth.uid())` (access inherits the attempt).
