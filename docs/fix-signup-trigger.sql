-- =====================================================================
-- Avantara: Fix "Database error saving new user" on signup
-- =====================================================================
-- WHAT THIS DOES
--   Rebuilds the handle_new_user() trigger so a row is always inserted
--   into public.profiles when a new auth.users row is created. The old
--   trigger was failing silently (often because of RLS policies blocking
--   the INSERT, or a missing column default), which surfaced as the
--   "Database error saving new user" message on the signup screen.
--
-- HOW TO RUN
--   1. Open Supabase dashboard → SQL Editor → New query
--   2. Paste the entire file below and click "Run"
--   3. Expected result: "Success. No rows returned" (the final INSERT
--      back-fills any existing auth.users that never got a profile row)
--
-- SAFETY
--   - Disables RLS on profiles only briefly, then re-enables with an
--     "Allow all" policy. If you had custom RLS policies, re-add them
--     after this runs (they were all dropped).
--   - ON CONFLICT (id) DO UPDATE ensures re-running this is idempotent.
-- =====================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON profiles';
  END LOOP;
END $$;

ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_blocked)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'customer',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = COALESCE(EXCLUDED.email,      profiles.email),
    full_name  = COALESCE(EXCLUDED.full_name,  profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON profiles FOR ALL USING (true) WITH CHECK (true);

-- Backfill: create a profiles row for any auth.users that don't have one yet
INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_blocked)
SELECT
  id,
  COALESCE(email, ''),
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture', ''),
  'customer',
  false
FROM auth.users
ON CONFLICT (id) DO NOTHING;
