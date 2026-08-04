/*
# Fix trigger function security

1. Revoke EXECUTE on handle_new_user from PUBLIC and anon — it's a trigger, not meant to be called via RPC
2. Set search_path on update_updated_at_column to avoid mutable search_path warning
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;

-- Recreate update_updated_at_column with explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
