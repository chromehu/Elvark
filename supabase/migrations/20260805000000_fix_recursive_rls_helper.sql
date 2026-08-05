/*
# Add secure is_active_admin() helper function

This function replaces all recursive admin checks in RLS policies.

## Security:
- SECURITY DEFINER: executes with table owner's privileges
- Fixed search_path: prevents search_path mutable attacks
- No caller-controlled parameters: caller_id cannot be passed in
- Derives user from auth.uid() internally only
- Checks: user exists, is admin role, and status is active
- Revoke PUBLIC/anon execute, grant to authenticated only
*/

-- Drop any existing version (idempotent)
DROP FUNCTION IF EXISTS public.is_active_admin();

-- Create the secure helper
CREATE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role user_role;
  v_status user_status;
BEGIN
  -- Get the current user's role and status
  SELECT role, status INTO v_role, v_status
  FROM profiles
  WHERE id = auth.uid();

  -- Return true only if admin and active
  RETURN (v_role = 'admin' AND v_status = 'active');
END;
$$;

-- Restrict access: only authenticated users can call
REVOKE EXECUTE ON FUNCTION public.is_active_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_active_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

-- Update profiles RLS policies to use the helper
DROP POLICY IF EXISTS profiles_select_own_or_admin ON profiles;
CREATE POLICY profiles_select_own_or_admin ON profiles FOR SELECT
  USING (id = auth.uid() OR is_active_admin());

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())  -- prevent role escalation
    AND status = (SELECT status FROM profiles WHERE id = auth.uid())  -- prevent status escalation
  );

DROP POLICY IF EXISTS profiles_delete_admin ON profiles;
CREATE POLICY profiles_delete_admin ON profiles FOR DELETE
  USING (is_active_admin());

-- Update instructor_profiles RLS policies to use the helper
DROP POLICY IF EXISTS instructor_profiles_select_own_or_admin ON instructor_profiles;
CREATE POLICY instructor_profiles_select_own_or_admin ON instructor_profiles FOR SELECT
  USING (user_id = auth.uid() OR is_active_admin());

DROP POLICY IF EXISTS instructor_profiles_insert_own ON instructor_profiles;
CREATE POLICY instructor_profiles_insert_own ON instructor_profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS instructor_profiles_delete_admin ON instructor_profiles;
CREATE POLICY instructor_profiles_delete_admin ON instructor_profiles FOR DELETE
  USING (is_active_admin());
