-- 005: question-source attribution (§17 of the quiz spec).
-- Safe & repeatable: ADD COLUMN IF NOT EXISTS.

alter table public.quiz_questions
  add column if not exists source text not null default 'local'
  check (source in ('local', 'ai', 'author'));

alter table public.quiz_attempts
  add column if not exists generation_mode text not null default 'local'
  check (generation_mode in ('local', 'ai', 'mixed'));
