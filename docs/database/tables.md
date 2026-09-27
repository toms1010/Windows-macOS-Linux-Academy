# Tables

## profiles (001)
| Column | Type | Constraints |
|---|---|---|
| id | uuid PK | FK → `auth.users(id)`, on delete cascade |
| full_name | text, nullable | — |
| avatar_url | text, nullable | — |
| created_at / updated_at | timestamptz not null | default `now()` (trigger-kept) |

## contact_messages (002)
| Column | Type | Constraints |
|---|---|---|
| id | uuid PK | default `gen_random_uuid()` |
| user_id | uuid, nullable | FK → `auth.users(id)`, on delete set null |
| name | text not null | length 1–100 |
| email | text not null | length 3–254 |
| message | text not null | length 1–5000 |
| status | text not null | default `'NEW'`, in `NEW/READ/ARCHIVED` |
| created_at / updated_at | timestamptz not null | default `now()` |
| Indexes | `created_at DESC`, `user_id` | — |

## quiz_questions (004)
`id` uuid PK · `quiz_id` text default `'os-basics'` · `topic`, `question`,
`correct_answer` text · `question_type` in single/multiple/true_false ·
`difficulty` in beginner/intermediate/advanced · `options` jsonb ·
`explanation`, `hint` text default `''` · `source` in local/ai/author (005) ·
`created_by` uuid nullable FK → auth.users · `created_at`.

## quiz_attempts (004)
`id` uuid PK · `user_id` FK → auth.users (cascade) · `quiz_id` ·
`score`, `total_questions` ≥ 0 · `percentage` 0–100 ·
`generation_mode` in local/ai/mixed (005) · `started_at` default now ·
`completed_at` nullable. Index `(user_id, completed_at desc)`.

## quiz_answers (004)
`id` uuid PK · `attempt_id` FK → quiz_attempts (cascade) ·
`question_id` text · `selected_answer` text · `is_correct` bool ·
`answered_at` default now.
