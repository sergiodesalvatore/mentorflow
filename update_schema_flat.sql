-- UPDATE SCHEMA FOR FLAT ROLE SYSTEM
-- 1. Ensure RLS is disabled for smooth "all users see all" experience
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 2. Clean up any bad data if necessary (optional, avoiding data loss)
-- (No delete commands here, just ensuring access)

-- 3. Ensure everyone can read everything (redundant if RLS disabled, but good for clarity)
-- drop policy if exists "Enable read access for all authenticated users" on public.profiles;
-- create policy "Enable read access for all authenticated users" on public.profiles for select to authenticated using (true);
