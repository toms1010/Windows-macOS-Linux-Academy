-- 003: Row Level Security. Ownership-based, no permissive `using (true)`
-- policies on user data. Repeatable: every policy is dropped first.

-- profiles ---------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- contact_messages -------------------------------------------------------
-- Public feedback form: anyone (anon + authenticated) may INSERT, but nobody
-- may read others' messages. Users can read their own linked messages.
alter table public.contact_messages enable row level security;

drop policy if exists "contact_insert_any" on public.contact_messages;
create policy "contact_insert_any"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_select_own" on public.contact_messages;
create policy "contact_select_own"
  on public.contact_messages for select
  to authenticated
  using (auth.uid() = user_id);

-- No update/delete policies for anon/authenticated: message moderation
-- stays server-side (service role) until an admin auth system exists.
