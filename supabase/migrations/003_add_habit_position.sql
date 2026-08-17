-- Add position column to habits table for drag-and-drop reordering
alter table public.habits
add column if not exists position integer default 0;

-- Create index for efficient ordering
create index if not exists habits_user_position_idx on public.habits(user_id, position);
