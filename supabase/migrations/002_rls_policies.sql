-- Row Level Security policies

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_entries enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Habits policies
create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can create own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- Habit entries policies
create policy "Users can view own habit entries"
  on public.habit_entries for select
  using (auth.uid() = user_id);

create policy "Users can create own habit entries"
  on public.habit_entries for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Users can update own habit entries"
  on public.habit_entries for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );

create policy "Users can delete own habit entries"
  on public.habit_entries for delete
  using (auth.uid() = user_id);
