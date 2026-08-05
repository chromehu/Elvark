/*
# Harden admin RPC functions

Update approve_instructor_application, reject_instructor_application, suspend_user, and reactivate_user
to be truly atomic and fail clearly when target record or expected state does not exist.

## Security improvements:
- Verify application/user exists before attempting changes
- Verify expected state (e.g., pending application) before approving
- Atomic transaction: all changes succeed or none do
- Clear exception messages for auditing
- Never silently succeed when no rows affected
- Admin auth check based only on is_active_admin() helper
*/

-- Recreate approve_instructor_application
DROP FUNCTION IF EXISTS public.approve_instructor_application(uuid);

CREATE FUNCTION public.approve_instructor_application(p_application_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_approval_status instructor_application_status;
  v_user_exists boolean;
  v_affected_count int;
BEGIN
  -- Verify caller is an active admin (using helper)
  IF NOT is_active_admin() THEN
    RAISE EXCEPTION 'Only active admins can approve applications';
  END IF;

  -- Verify target user exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = p_application_user_id)
  INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'Target user does not exist (id: %)', p_application_user_id;
  END IF;

  -- Verify application exists and is pending
  SELECT approval_status INTO v_approval_status
  FROM instructor_profiles
  WHERE user_id = p_application_user_id;

  IF v_approval_status IS NULL THEN
    RAISE EXCEPTION 'No instructor application found for user (id: %)', p_application_user_id;
  END IF;
  IF v_approval_status != 'pending' THEN
    RAISE EXCEPTION 'Cannot approve: application status is not pending (status: %)', v_approval_status;
  END IF;

  -- Atomic: update both instructor_profiles and profiles in one transaction
  UPDATE instructor_profiles
  SET
    approval_status = 'approved'::instructor_application_status,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  WHERE user_id = p_application_user_id;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;
  IF v_affected_count != 1 THEN
    RAISE EXCEPTION 'Failed to update instructor application';
  END IF;

  -- Update user role to instructor
  UPDATE profiles
  SET role = 'instructor'::user_role, updated_at = now()
  WHERE id = p_application_user_id;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;
  IF v_affected_count != 1 THEN
    RAISE EXCEPTION 'Failed to update user role';
  END IF;

END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_instructor_application(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_instructor_application(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_instructor_application(uuid) TO authenticated;

-- Recreate reject_instructor_application
DROP FUNCTION IF EXISTS public.reject_instructor_application(uuid, text);

CREATE FUNCTION public.reject_instructor_application(
  p_application_user_id uuid,
  p_rejection_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_approval_status instructor_application_status;
  v_user_exists boolean;
  v_affected_count int;
BEGIN
  -- Verify caller is an active admin
  IF NOT is_active_admin() THEN
    RAISE EXCEPTION 'Only active admins can reject applications';
  END IF;

  -- Verify target user exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = p_application_user_id)
  INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'Target user does not exist (id: %)', p_application_user_id;
  END IF;

  -- Verify application exists and is pending
  SELECT approval_status INTO v_approval_status
  FROM instructor_profiles
  WHERE user_id = p_application_user_id;

  IF v_approval_status IS NULL THEN
    RAISE EXCEPTION 'No instructor application found for user (id: %)', p_application_user_id;
  END IF;
  IF v_approval_status != 'pending' THEN
    RAISE EXCEPTION 'Cannot reject: application status is not pending (status: %)', v_approval_status;
  END IF;

  -- Update application to rejected with reason
  UPDATE instructor_profiles
  SET
    approval_status = 'rejected'::instructor_application_status,
    rejection_reason = TRIM(COALESCE(p_rejection_reason, '')),
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  WHERE user_id = p_application_user_id;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;
  IF v_affected_count != 1 THEN
    RAISE EXCEPTION 'Failed to update instructor application';
  END IF;

END;
$$;

REVOKE EXECUTE ON FUNCTION public.reject_instructor_application(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_instructor_application(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.reject_instructor_application(uuid, text) TO authenticated;

-- Recreate suspend_user
DROP FUNCTION IF EXISTS public.suspend_user(uuid);

CREATE FUNCTION public.suspend_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_exists boolean;
  v_affected_count int;
BEGIN
  -- Verify caller is an active admin
  IF NOT is_active_admin() THEN
    RAISE EXCEPTION 'Only active admins can suspend users';
  END IF;

  -- Verify target user exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = p_user_id)
  INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'Target user does not exist (id: %)', p_user_id;
  END IF;

  -- Suspend user
  UPDATE profiles
  SET status = 'suspended'::user_status, updated_at = now()
  WHERE id = p_user_id;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;
  IF v_affected_count != 1 THEN
    RAISE EXCEPTION 'Failed to suspend user';
  END IF;

END;
$$;

REVOKE EXECUTE ON FUNCTION public.suspend_user(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.suspend_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.suspend_user(uuid) TO authenticated;

-- Recreate reactivate_user
DROP FUNCTION IF EXISTS public.reactivate_user(uuid);

CREATE FUNCTION public.reactivate_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_exists boolean;
  v_affected_count int;
BEGIN
  -- Verify caller is an active admin
  IF NOT is_active_admin() THEN
    RAISE EXCEPTION 'Only active admins can reactivate users';
  END IF;

  -- Verify target user exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = p_user_id)
  INTO v_user_exists;
  IF NOT v_user_exists THEN
    RAISE EXCEPTION 'Target user does not exist (id: %)', p_user_id;
  END IF;

  -- Reactivate user
  UPDATE profiles
  SET status = 'active'::user_status, updated_at = now()
  WHERE id = p_user_id;

  GET DIAGNOSTICS v_affected_count = ROW_COUNT;
  IF v_affected_count != 1 THEN
    RAISE EXCEPTION 'Failed to reactivate user';
  END IF;

END;
$$;

REVOKE EXECUTE ON FUNCTION public.reactivate_user(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reactivate_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.reactivate_user(uuid) TO authenticated;
