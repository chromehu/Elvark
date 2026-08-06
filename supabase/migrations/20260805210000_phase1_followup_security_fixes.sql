BEGIN;

-- ============================================================
-- 1. Consent audit fields
-- ============================================================

ALTER TABLE public.instructor_profiles
  ADD COLUMN IF NOT EXISTS instructor_terms_version text,
  ADD COLUMN IF NOT EXISTS instructor_terms_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS content_rights_confirmed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS content_rights_confirmed_at timestamptz;

COMMENT ON COLUMN public.instructor_profiles.instructor_terms_version
  IS 'Version of the instructor terms accepted when the application was submitted.';
COMMENT ON COLUMN public.instructor_profiles.instructor_terms_accepted_at
  IS 'Server timestamp when the instructor terms were accepted.';
COMMENT ON COLUMN public.instructor_profiles.content_rights_confirmed
  IS 'Whether the applicant affirmed that they have the necessary rights to submitted teaching content.';
COMMENT ON COLUMN public.instructor_profiles.content_rights_confirmed_at
  IS 'Server timestamp when the content-rights affirmation was recorded.';

-- ============================================================
-- 2. Non-recursive authorization helpers
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_active_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND status = 'active'::public.user_status
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'::public.user_role
      AND status = 'active'::public.user_status
  );
$$;

REVOKE ALL ON FUNCTION public.is_active_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_active_user() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated;

REVOKE ALL ON FUNCTION public.is_active_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_active_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_active_admin() TO authenticated;

-- ============================================================
-- 3. Replace recursive and overlapping RLS policies
-- ============================================================

DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles;
CREATE POLICY profiles_select_own_or_admin
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_active_admin());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS profiles_delete_admin ON public.profiles;
DROP POLICY IF EXISTS instructor_profiles_delete_admin ON public.instructor_profiles;

DROP POLICY IF EXISTS instructor_profiles_select_own_admin_or_approved ON public.instructor_profiles;
DROP POLICY IF EXISTS instructor_profiles_select_own_or_admin ON public.instructor_profiles;
DROP POLICY IF EXISTS instructor_profiles_insert_own ON public.instructor_profiles;
DROP POLICY IF EXISTS instructor_profiles_update_own_pending_or_rejected ON public.instructor_profiles;

CREATE POLICY instructor_profiles_select_authorized
ON public.instructor_profiles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_active_admin()
  OR (
    approval_status = 'approved'::public.instructor_application_status
    AND public.is_active_user()
  )
);

REVOKE INSERT, UPDATE, DELETE ON public.instructor_profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.instructor_profiles FROM authenticated;
GRANT SELECT ON public.instructor_profiles TO authenticated;

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, avatar_url) ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- ============================================================
-- 4. Application RPCs
-- ============================================================

DROP FUNCTION IF EXISTS public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
);
DROP FUNCTION IF EXISTS public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
);

CREATE FUNCTION public.submit_instructor_application(
  p_public_name text,
  p_professional_title text,
  p_biography text,
  p_experience text,
  p_teaching_topics text,
  p_website_url text,
  p_social_url text,
  p_application_message text,
  p_instructor_terms_version text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_status public.user_status;
  v_public_name text := btrim(coalesce(p_public_name, ''));
  v_professional_title text := btrim(coalesce(p_professional_title, ''));
  v_biography text := btrim(coalesce(p_biography, ''));
  v_experience text := btrim(coalesce(p_experience, ''));
  v_teaching_topics text := btrim(coalesce(p_teaching_topics, ''));
  v_website_url text := nullif(btrim(coalesce(p_website_url, '')), '');
  v_social_url text := nullif(btrim(coalesce(p_social_url, '')), '');
  v_application_message text := btrim(coalesce(p_application_message, ''));
  v_terms_version text := btrim(coalesce(p_instructor_terms_version, ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.' USING ERRCODE = '42501';
  END IF;

  SELECT status INTO v_status
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_status <> 'active'::public.user_status THEN
    RAISE EXCEPTION 'Only active users may submit an application.' USING ERRCODE = '42501';
  END IF;

  IF char_length(v_public_name) NOT BETWEEN 2 AND 100 THEN
    RAISE EXCEPTION 'Public name must be between 2 and 100 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_professional_title) NOT BETWEEN 2 AND 120 THEN
    RAISE EXCEPTION 'Professional title must be between 2 and 120 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_biography) NOT BETWEEN 20 AND 4000 THEN
    RAISE EXCEPTION 'Biography must be between 20 and 4000 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_experience) NOT BETWEEN 2 AND 4000 THEN
    RAISE EXCEPTION 'Experience must be between 2 and 4000 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_teaching_topics) NOT BETWEEN 2 AND 1000 THEN
    RAISE EXCEPTION 'Teaching topics must be between 2 and 1000 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_application_message) NOT BETWEEN 2 AND 2000 THEN
    RAISE EXCEPTION 'Application message must be between 2 and 2000 characters.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_terms_version) NOT BETWEEN 1 AND 64
     OR v_terms_version !~ '^[A-Za-z0-9._-]+$' THEN
    RAISE EXCEPTION 'A valid instructor terms version is required.' USING ERRCODE = '22023';
  END IF;
  IF v_website_url IS NOT NULL
     AND (char_length(v_website_url) > 2048 OR v_website_url !~* '^https?://') THEN
    RAISE EXCEPTION 'Website URL must use HTTP or HTTPS.' USING ERRCODE = '22023';
  END IF;
  IF v_social_url IS NOT NULL
     AND (char_length(v_social_url) > 2048 OR v_social_url !~* '^https?://') THEN
    RAISE EXCEPTION 'Social URL must use HTTP or HTTPS.' USING ERRCODE = '22023';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.instructor_profiles WHERE user_id = v_user_id
  ) THEN
    RAISE EXCEPTION 'An instructor application already exists.' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.instructor_profiles (
    user_id,
    public_name,
    professional_title,
    biography,
    experience,
    teaching_topics,
    website_url,
    social_url,
    application_message,
    approval_status,
    rejection_reason,
    applied_at,
    reviewed_at,
    reviewed_by,
    instructor_terms_version,
    instructor_terms_accepted_at,
    content_rights_confirmed,
    content_rights_confirmed_at
  ) VALUES (
    v_user_id,
    v_public_name,
    v_professional_title,
    v_biography,
    v_experience,
    v_teaching_topics,
    v_website_url,
    v_social_url,
    v_application_message,
    'pending'::public.instructor_application_status,
    NULL,
    now(),
    NULL,
    NULL,
    v_terms_version,
    now(),
    true,
    now()
  );
END;
$$;

CREATE FUNCTION public.resubmit_instructor_application(
  p_public_name text,
  p_professional_title text,
  p_biography text,
  p_experience text,
  p_teaching_topics text,
  p_website_url text,
  p_social_url text,
  p_application_message text,
  p_instructor_terms_version text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_status public.user_status;
  v_affected integer;
  v_public_name text := btrim(coalesce(p_public_name, ''));
  v_professional_title text := btrim(coalesce(p_professional_title, ''));
  v_biography text := btrim(coalesce(p_biography, ''));
  v_experience text := btrim(coalesce(p_experience, ''));
  v_teaching_topics text := btrim(coalesce(p_teaching_topics, ''));
  v_website_url text := nullif(btrim(coalesce(p_website_url, '')), '');
  v_social_url text := nullif(btrim(coalesce(p_social_url, '')), '');
  v_application_message text := btrim(coalesce(p_application_message, ''));
  v_terms_version text := btrim(coalesce(p_instructor_terms_version, ''));
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required.' USING ERRCODE = '42501';
  END IF;

  SELECT status INTO v_status
  FROM public.profiles
  WHERE id = v_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_status <> 'active'::public.user_status THEN
    RAISE EXCEPTION 'Only active users may resubmit an application.' USING ERRCODE = '42501';
  END IF;

  IF char_length(v_public_name) NOT BETWEEN 2 AND 100
     OR char_length(v_professional_title) NOT BETWEEN 2 AND 120
     OR char_length(v_biography) NOT BETWEEN 20 AND 4000
     OR char_length(v_experience) NOT BETWEEN 2 AND 4000
     OR char_length(v_teaching_topics) NOT BETWEEN 2 AND 1000
     OR char_length(v_application_message) NOT BETWEEN 2 AND 2000 THEN
    RAISE EXCEPTION 'One or more required application fields are invalid.' USING ERRCODE = '22023';
  END IF;
  IF char_length(v_terms_version) NOT BETWEEN 1 AND 64
     OR v_terms_version !~ '^[A-Za-z0-9._-]+$' THEN
    RAISE EXCEPTION 'A valid instructor terms version is required.' USING ERRCODE = '22023';
  END IF;
  IF v_website_url IS NOT NULL
     AND (char_length(v_website_url) > 2048 OR v_website_url !~* '^https?://') THEN
    RAISE EXCEPTION 'Website URL must use HTTP or HTTPS.' USING ERRCODE = '22023';
  END IF;
  IF v_social_url IS NOT NULL
     AND (char_length(v_social_url) > 2048 OR v_social_url !~* '^https?://') THEN
    RAISE EXCEPTION 'Social URL must use HTTP or HTTPS.' USING ERRCODE = '22023';
  END IF;

  UPDATE public.instructor_profiles
  SET public_name = v_public_name,
      professional_title = v_professional_title,
      biography = v_biography,
      experience = v_experience,
      teaching_topics = v_teaching_topics,
      website_url = v_website_url,
      social_url = v_social_url,
      application_message = v_application_message,
      approval_status = 'pending'::public.instructor_application_status,
      rejection_reason = NULL,
      reviewed_at = NULL,
      reviewed_by = NULL,
      applied_at = now(),
      instructor_terms_version = v_terms_version,
      instructor_terms_accepted_at = now(),
      content_rights_confirmed = true,
      content_rights_confirmed_at = now()
  WHERE user_id = v_user_id
    AND approval_status = 'rejected'::public.instructor_application_status;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'Only a rejected application can be resubmitted.' USING ERRCODE = '55000';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) TO authenticated;

REVOKE ALL ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM anon;
GRANT EXECUTE ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) TO authenticated;

-- ============================================================
-- 5. Concurrency-safe admin RPCs
-- ============================================================

DROP FUNCTION IF EXISTS public.approve_instructor_application(uuid);
DROP FUNCTION IF EXISTS public.reject_instructor_application(uuid, text);
DROP FUNCTION IF EXISTS public.suspend_user(uuid);
DROP FUNCTION IF EXISTS public.reactivate_user(uuid);

CREATE FUNCTION public.approve_instructor_application(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_role public.user_role;
  v_status public.user_status;
  v_application_status public.instructor_application_status;
  v_affected integer;
BEGIN
  IF NOT public.is_active_admin() THEN
    RAISE EXCEPTION 'Only an active administrator may approve applications.' USING ERRCODE = '42501';
  END IF;

  SELECT role, status
  INTO v_role, v_status
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_status <> 'active'::public.user_status THEN
    RAISE EXCEPTION 'A suspended user cannot be approved.' USING ERRCODE = '55000';
  END IF;
  IF v_role = 'admin'::public.user_role THEN
    RAISE EXCEPTION 'An administrator cannot be converted to instructor.' USING ERRCODE = '55000';
  END IF;

  SELECT approval_status
  INTO v_application_status
  FROM public.instructor_profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Instructor application not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_application_status <> 'pending'::public.instructor_application_status THEN
    RAISE EXCEPTION 'Only a pending application can be approved.' USING ERRCODE = '55000';
  END IF;

  UPDATE public.instructor_profiles
  SET approval_status = 'approved'::public.instructor_application_status,
      rejection_reason = NULL,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE user_id = p_user_id
    AND approval_status = 'pending'::public.instructor_application_status;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'Application state changed before approval completed.' USING ERRCODE = '40001';
  END IF;

  UPDATE public.profiles
  SET role = 'instructor'::public.user_role
  WHERE id = p_user_id
    AND status = 'active'::public.user_status
    AND role <> 'admin'::public.user_role;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'User role could not be updated.' USING ERRCODE = '40001';
  END IF;
END;
$$;

CREATE FUNCTION public.reject_instructor_application(
  p_user_id uuid,
  p_rejection_reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_reason text := btrim(coalesce(p_rejection_reason, ''));
  v_application_status public.instructor_application_status;
  v_affected integer;
BEGIN
  IF NOT public.is_active_admin() THEN
    RAISE EXCEPTION 'Only an active administrator may reject applications.' USING ERRCODE = '42501';
  END IF;
  IF char_length(v_reason) NOT BETWEEN 5 AND 2000 THEN
    RAISE EXCEPTION 'Rejection reason must be between 5 and 2000 characters.' USING ERRCODE = '22023';
  END IF;

  PERFORM 1
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found.' USING ERRCODE = 'P0002';
  END IF;

  SELECT approval_status
  INTO v_application_status
  FROM public.instructor_profiles
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Instructor application not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_application_status <> 'pending'::public.instructor_application_status THEN
    RAISE EXCEPTION 'Only a pending application can be rejected.' USING ERRCODE = '55000';
  END IF;

  UPDATE public.instructor_profiles
  SET approval_status = 'rejected'::public.instructor_application_status,
      rejection_reason = v_reason,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE user_id = p_user_id
    AND approval_status = 'pending'::public.instructor_application_status;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'Application state changed before rejection completed.' USING ERRCODE = '40001';
  END IF;
END;
$$;

CREATE FUNCTION public.suspend_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_role public.user_role;
  v_status public.user_status;
  v_affected integer;
BEGIN
  IF NOT public.is_active_admin() THEN
    RAISE EXCEPTION 'Only an active administrator may suspend users.' USING ERRCODE = '42501';
  END IF;
  IF p_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot suspend their own account.' USING ERRCODE = '55000';
  END IF;

  SELECT role, status
  INTO v_role, v_status
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_role = 'admin'::public.user_role THEN
    RAISE EXCEPTION 'Administrator accounts cannot be suspended through this RPC.' USING ERRCODE = '55000';
  END IF;
  IF v_status = 'suspended'::public.user_status THEN
    RAISE EXCEPTION 'User is already suspended.' USING ERRCODE = '55000';
  END IF;

  UPDATE public.profiles
  SET status = 'suspended'::public.user_status
  WHERE id = p_user_id
    AND status = 'active'::public.user_status;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'User state changed before suspension completed.' USING ERRCODE = '40001';
  END IF;
END;
$$;

CREATE FUNCTION public.reactivate_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_role public.user_role;
  v_status public.user_status;
  v_affected integer;
BEGIN
  IF NOT public.is_active_admin() THEN
    RAISE EXCEPTION 'Only an active administrator may reactivate users.' USING ERRCODE = '42501';
  END IF;

  SELECT role, status
  INTO v_role, v_status
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Target user not found.' USING ERRCODE = 'P0002';
  END IF;
  IF v_role = 'admin'::public.user_role THEN
    RAISE EXCEPTION 'Administrator accounts cannot be managed through this RPC.' USING ERRCODE = '55000';
  END IF;
  IF v_status = 'active'::public.user_status THEN
    RAISE EXCEPTION 'User is already active.' USING ERRCODE = '55000';
  END IF;

  UPDATE public.profiles
  SET status = 'active'::public.user_status
  WHERE id = p_user_id
    AND status = 'suspended'::public.user_status;

  GET DIAGNOSTICS v_affected = ROW_COUNT;
  IF v_affected <> 1 THEN
    RAISE EXCEPTION 'User state changed before reactivation completed.' USING ERRCODE = '40001';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_instructor_application(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.approve_instructor_application(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_instructor_application(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.reject_instructor_application(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_instructor_application(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.reject_instructor_application(uuid, text) TO authenticated;

REVOKE ALL ON FUNCTION public.suspend_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.suspend_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.suspend_user(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.reactivate_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reactivate_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.reactivate_user(uuid) TO authenticated;

COMMIT;
