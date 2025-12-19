-- NUCLEAR OPTION: DISABLE RLS COMPLETELY
-- This ensures that NO permission checks are performed by the database.
-- If this doesn't work, the issue is logic/frontend, NOT permissions.

BEGIN;

-- 1. Disable RLS on Profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS on Projects
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 3. Verify it's off (Just a comment, check in dashboard UI if needed)
-- RLS should now be "OFF" for these tables.

COMMIT;
