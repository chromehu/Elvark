/*
# Revoke anon execute on SECURITY DEFINER functions

The functions were still executable by the `anon` role because PostgreSQL
grants EXECUTE to PUBLIC by default when a function is created. The previous
migration's `REVOKE ... FROM anon` didn't take effect because the default
PUBLIC grant overrides it. This migration revokes EXECUTE from PUBLIC and
then grants it only to `authenticated`.

## Functions affected:
- approve_instructor_application
- reject_instructor_application
- suspend_user
- reactivate_user

## Security:
- anon role can no longer call any of these functions
- Only authenticated users can call them
- Each function internally checks that the caller is an admin via auth.uid()
*/

REVOKE EXECUTE ON FUNCTION public.approve_instructor_application(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.approve_instructor_application(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_instructor_application(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.reject_instructor_application(UUID, TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reject_instructor_application(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.reject_instructor_application(UUID, TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.suspend_user(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.suspend_user(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.suspend_user(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.reactivate_user(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.reactivate_user(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.reactivate_user(UUID) TO authenticated;
