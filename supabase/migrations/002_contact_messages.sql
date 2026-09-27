-- 002: contact_messages table (feedback form submissions).
-- Nullable user_id: anonymous visitors may submit; logged-in users get linked.
-- Safe & repeatable: CREATE TABLE IF NOT EXISTS.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'NEW' check (status in ('NEW', 'READ', 'ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created
  on public.contact_messages (created_at desc);
create index if not exists idx_contact_messages_user
  on public.contact_messages (user_id);

drop trigger if exists trg_contact_messages_updated_at on public.contact_messages;
create trigger trg_contact_messages_updated_at
  before update on public.contact_messages
  for each row execute function public.touch_updated_at();
