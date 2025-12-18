-- Allow Mentors (supervisors) to view all profiles
create policy "Mentors can view all profiles." on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'supervisor'
    )
  );

-- Also allow users to view their own profile (already covered by default mostly, but good to be explicit for self-checks)
create policy "Users can view their own profile." on public.profiles
  for select using (
    auth.uid() = id
  );

-- Allow Mentors to delete profiles (already implemented manually in TeamPage via soft delete/hard delete, but policy is needed)
create policy "Mentors can delete profiles." on public.profiles
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'supervisor'
    )
  );
