-- Create a table for public profiles (synced with auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  role text check (role in ('supervisor', 'intern')),
  avatar text,
  specialty text,
  course_year text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
-- Everyone can read profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

-- Users can insert their own profile
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update own profile
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Trigger to create profile on signup
-- This ensures that when a user signs up via Auth, a row is created in public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, avatar, specialty, course_year)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'avatar',
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'courseYear'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Projects Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in-progress', 'review', 'done')) default 'todo',
  deadline timestamp with time zone,
  created_by_id uuid references public.profiles(id),
  assigned_to_id uuid references public.profiles(id),
  -- Store checklist and comments as JSONB for simplicity since we are prototyping
  -- Ideally these would be separate tables, but JSONB is fine for now
  checklist jsonb default '[]'::jsonb,
  comments jsonb default '[]'::jsonb
);

-- Enable RLS
alter table public.projects enable row level security;

-- Policies for Projects
-- Everyone can view projects (or restrict to involved users later)
create policy "Projects are viewable by everyone." on public.projects
  for select using (true);

-- Mentors (supervisor) can insert projects
create policy "Mentors can insert projects." on public.projects
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'supervisor'
    )
  );

-- Mentors can delete projects
create policy "Mentors can delete projects." on public.projects
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'supervisor'
    )
  );

-- Everyone (involved) can update projects (status, checklist, etc)
create policy "Everyone can update projects." on public.projects
  for update using (true);
