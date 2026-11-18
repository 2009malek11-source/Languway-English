-- LanguWay English: cloud progress storage.
-- Run this once in Supabase: SQL Editor > New query > paste > Run.

create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

do $$ begin
  alter table public.progress add constraint progress_size check (pg_column_size(data) < 200000);
exception when duplicate_object then null; end $$;

alter table public.progress enable row level security;

drop policy if exists "progress select own" on public.progress;
drop policy if exists "progress insert own" on public.progress;
drop policy if exists "progress update own" on public.progress;
drop policy if exists "progress delete own" on public.progress;
create policy "progress select own" on public.progress for select using (auth.uid() = user_id);
create policy "progress insert own" on public.progress for insert with check (auth.uid() = user_id);
create policy "progress update own" on public.progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "progress delete own" on public.progress for delete using (auth.uid() = user_id);

revoke all on public.progress from anon;
grant select, insert, update, delete on public.progress to authenticated;

-- Lets a signed-in learner delete their own account (used by Settings > Delete account).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- v23 hardening (least privilege): API roles never need TRUNCATE/TRIGGER/REFERENCES, and the sign-up log is private.
revoke truncate, trigger, references on public.progress from authenticated, anon;
revoke all on public.signup_attempts from anon, authenticated;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ===== Certificates (v25): server-issued, verifiable by code =====
create table if not exists public.certificates(
  code text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('level','course')),
  level int not null default 0 check (level between 0 and 30),
  holder text not null check (char_length(holder) between 1 and 60),
  score int not null check (score between 0 and 100),
  issued_at timestamptz not null default now(),
  unique (user_id, kind, level));
alter table public.certificates enable row level security;
revoke all on public.certificates from anon, authenticated;
grant select on public.certificates to authenticated;
drop policy if exists cert_own_select on public.certificates;
create policy cert_own_select on public.certificates for select to authenticated using (user_id = (select auth.uid()));
-- Functions issue_certificate(kind, level) and verify_certificate(code) are already applied on the live project (migration "certificates_issue_and_verify").
