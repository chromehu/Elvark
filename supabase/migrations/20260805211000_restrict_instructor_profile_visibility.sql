BEGIN;

-- Full instructor application records contain private review and consent data.
-- Limit direct table reads to the application owner and active administrators.
-- Public instructor data should later be exposed through a dedicated safe view.
DROP POLICY IF EXISTS instructor_profiles_select_authorized
  ON public.instructor_profiles;

DROP POLICY IF EXISTS instructor_profiles_select_own_or_admin
  ON public.instructor_profiles;

CREATE POLICY instructor_profiles_select_own_or_admin
ON public.instructor_profiles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_active_admin()
);

COMMIT;
