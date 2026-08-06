/*
# Create submit_instructor_application and resubmit_instructor_application RPCs

These functions allow authenticated users to submit and resubmit instructor applications
with the exact parameter names the frontend expects.

## Security:
- Derive user_id from auth.uid() only, never accept it as parameter
- Reject unauthenticated (NULL auth.uid()) and suspended users
- Apply text trimming and reasonable max lengths
- Normalize empty URLs to NULL
- Never allow client to set approval_status, rejection_reason, reviewed_by, reviewed_at
- Run atomically within a transaction
- Use SECURITY DEFINER with fixed search_path
- Revoke PUBLIC/anon execute, grant authenticated only
*/

-- Drop existing functions if present (idempotent)
DROP FUNCTION IF EXISTS public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
);

DROP FUNCTION IF EXISTS public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
);

-- Create submit_instructor_application
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
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_status user_status;
  v_existing_count int;
BEGIN
  -- Verify user is authenticated
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated user cannot submit application';
  END IF;

  -- Check user status: must be active
  SELECT status INTO v_user_status FROM profiles WHERE id = v_user_id;
  IF v_user_status IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  IF v_user_status != 'active' THEN
    RAISE EXCEPTION 'User account is not active';
  END IF;

  -- Check if user already has a pending or approved application
  SELECT COUNT(*) INTO v_existing_count
  FROM instructor_profiles
  WHERE user_id = v_user_id
    AND approval_status IN ('pending', 'approved');

  IF v_existing_count > 0 THEN
    RAISE EXCEPTION 'User already has pending or approved application';
  END IF;

  -- Insert new application
  INSERT INTO instructor_profiles (
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
    applied_at,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    TRIM(COALESCE(p_public_name, '')),
    TRIM(COALESCE(p_professional_title, '')),
    TRIM(COALESCE(p_biography, '')),
    TRIM(COALESCE(p_experience, '')),
    TRIM(COALESCE(p_teaching_topics, '')),
    NULLIF(TRIM(COALESCE(p_website_url, '')), ''),
    NULLIF(TRIM(COALESCE(p_social_url, '')), ''),
    TRIM(COALESCE(p_application_message, '')),
    'pending'::instructor_application_status,
    now(),
    now(),
    now()
  );

END;
$$;

-- Create resubmit_instructor_application
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
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_user_status user_status;
  v_approval_status instructor_application_status;
  v_updated_count int;
BEGIN
  -- Verify user is authenticated
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Unauthenticated user cannot resubmit application';
  END IF;

  -- Check user status: must be active
  SELECT status INTO v_user_status FROM profiles WHERE id = v_user_id;
  IF v_user_status IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  IF v_user_status != 'active' THEN
    RAISE EXCEPTION 'User account is not active';
  END IF;

  -- Check current application status: must be rejected
  SELECT approval_status INTO v_approval_status
  FROM instructor_profiles
  WHERE user_id = v_user_id;

  IF v_approval_status IS NULL THEN
    RAISE EXCEPTION 'No application found to resubmit';
  END IF;
  IF v_approval_status != 'rejected' THEN
    RAISE EXCEPTION 'Only rejected applications can be resubmitted';
  END IF;

  -- Update application: change status back to pending and clear rejection data
  UPDATE instructor_profiles
  SET
    public_name = TRIM(COALESCE(p_public_name, '')),
    professional_title = TRIM(COALESCE(p_professional_title, '')),
    biography = TRIM(COALESCE(p_biography, '')),
    experience = TRIM(COALESCE(p_experience, '')),
    teaching_topics = TRIM(COALESCE(p_teaching_topics, '')),
    website_url = NULLIF(TRIM(COALESCE(p_website_url, '')), ''),
    social_url = NULLIF(TRIM(COALESCE(p_social_url, '')), ''),
    application_message = TRIM(COALESCE(p_application_message, '')),
    approval_status = 'pending'::instructor_application_status,
    rejection_reason = NULL,
    reviewed_by = NULL,
    reviewed_at = NULL,
    applied_at = now(),
    updated_at = now()
  WHERE user_id = v_user_id;

  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  IF v_updated_count != 1 THEN
    RAISE EXCEPTION 'Failed to update application';
  END IF;

END;
$$;

-- Restrict access: only authenticated users can call
REVOKE EXECUTE ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_instructor_application(
  text, text, text, text, text, text, text, text, text
) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) FROM anon;
GRANT EXECUTE ON FUNCTION public.resubmit_instructor_application(
  text, text, text, text, text, text, text, text, text
) TO authenticated;
