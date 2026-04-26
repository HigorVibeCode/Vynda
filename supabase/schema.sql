-- Vynda: schema inicial. Rode UMA VEZ no Supabase: SQL Editor > New query > Colar > Run.
-- Extensao usada por gen_random_uuid (no Supabase costuma vir habilitada).
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_date date,
  streak_days int not null default 0,
  total_xp int not null default 0
);

create table if not exists public.pillars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  icon text not null,
  active boolean not null default true,
  current_xp int not null default 0,
  xp_to_next_level int not null default 500,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  pillar_id uuid not null references public.pillars(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  xp int not null default 100,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.pillars enable row level security;
alter table public.goals enable row level security;

drop policy if exists "profiles-own-row" on public.profiles;
create policy "profiles-own-row"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "pillars-own-rows" on public.pillars;
create policy "pillars-own-rows"
  on public.pillars for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "goals-own-rows" on public.goals;
create policy "goals-own-rows"
  on public.goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
