-- 004: quiz persistence (modular — the UI works fully local-first;
-- wire these tables in only when quiz history is required).
-- Safe & repeatable: CREATE TABLE IF NOT EXISTS + drop-then-create policies.

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id text not null default 'os-basics',
  topic text not null,
  question text not null,
  question_type text not null default 'single_choice'
    check (question_type in ('single_choice', 'multiple_choice', 'true_false')),
  difficulty text not null default 'beginner'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null default '',
  hint text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  quiz_id text not null default 'os-basics',
  score int not null default 0 check (score >= 0),
  total_questions int not null default 0 check (total_questions >= 0),
  percentage int not null default 0 check (percentage between 0 and 100),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id text not null,
  selected_answer text not null,
  is_correct boolean not null default false,
  answered_at timestamptz not null default now()
);

create index if not exists idx_quiz_attempts_user
  on public.quiz_attempts (user_id, completed_at desc);

-- RLS: users access only their own attempts/answers; curated questions
-- (created_by IS NULL) are readable by everyone, private ones by their owner.
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;

drop policy if exists "quiz_questions_read" on public.quiz_questions;
create policy "quiz_questions_read"
  on public.quiz_questions for select
  to anon, authenticated
  using (created_by is null or auth.uid() = created_by);

drop policy if exists "quiz_questions_insert_own" on public.quiz_questions;
create policy "quiz_questions_insert_own"
  on public.quiz_questions for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "quiz_attempts_own" on public.quiz_attempts;
create policy "quiz_attempts_own"
  on public.quiz_attempts for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "quiz_answers_via_attempt" on public.quiz_answers;
create policy "quiz_answers_via_attempt"
  on public.quiz_answers for all
  to authenticated
  using (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = quiz_answers.attempt_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quiz_attempts a
      where a.id = quiz_answers.attempt_id and a.user_id = auth.uid()
    )
  );
