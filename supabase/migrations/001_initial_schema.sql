-- Initial schema for habit tracker
-- Run in Supabase SQL Editor or via supabase db push

-- Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habits table
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint habits_name_length check (char_length(trim(name)) between 1 and 100),
  constraint habits_user_name_unique unique (user_id, name)
);

-- Habit entries (daily validations)
create table if not exists public.habit_entries (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  status text not null check (status in ('positive', 'negative')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(habit_id, date)
);

-- Indexes
create index if not exists habits_user_id_idx on public.habits(user_id);
create index if not exists habit_entries_habit_id_idx on public.habit_entries(habit_id);
create index if not exists habit_entries_user_id_idx on public.habit_entries(user_id);
create index if not exists habit_entries_date_idx on public.habit_entries(date);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists habits_updated_at on public.habits;
create trigger habits_updated_at
  before update on public.habits
  for each row execute function public.set_updated_at();

drop trigger if exists habit_entries_updated_at on public.habit_entries;
create trigger habit_entries_updated_at
  before update on public.habit_entries
  for each row execute function public.set_updated_at();
