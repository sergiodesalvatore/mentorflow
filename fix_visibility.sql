-- FIX VISIBILITY ISSUES
-- Drop existing policies that might be conflicting or too strict
drop policy if exists "Mentors can view all profiles." on public.profiles;
drop policy if exists "Mentors can view all profiles" on public.profiles;
drop policy if exists "Users can view their own profile." on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

-- Create a simple, permissive policy: Authenticated users can see ALL profiles
-- This is necessary for Mentors to see Mentees, and for Mentees to be assignable
create policy "Enable read access for all authenticated users"
on public.profiles
for select
to authenticated
using (true);

-- Ensure insert/update/delete are still protected
-- Insert: Users can insert their own (handled by trigger usually, but good to keep)
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- Update: Users can update their own
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

-- Delete: Mentors can delete any profile (soft delete logic or admin cleanup)
create policy "Mentors can delete any profile"
on public.profiles
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'supervisor'
  )
);
