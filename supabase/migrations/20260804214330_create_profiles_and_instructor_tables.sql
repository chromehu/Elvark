/*
# Create profiles, instructor_profiles tables with enums, triggers, and RLS

## Overview
This migration creates the foundational authentication and authorization schema for the ELVARK platform.
It establishes user profiles linked to Supabase auth.users, instructor application profiles,
and secure row-level security policies. All role/status changes are protected by SECURITY DEFINER functions.

## 1. Enums

### user_role
- `student` — default role for every new user
- `instructor` — assigned only after admin approval of an instructor application
- `admin` — assigned only by a database owner via SQL

### user_status
- `active` — default status for every new user
- `suspended` — set by admin; blocks dashboard/instructor/admin access

### instructor_application_status
- `not_applied` — user has never submitted an instructor application
- `pending` — application submitted, awaiting admin review
- `approved` — admin approved; user role changed to instructor
- `rejected` — admin rejected; user may edit and resubmit
- `suspended` — admin suspended instructor privileges

## 2. Tables

### profiles
One-to-one with `auth.users`. Stores the user's display name, email, role, and status.
- `id` UUID PK → references `auth.users(id)` ON DELETE CASCADE
- `email` text — synchronized from auth.users email
- `full_name` text — user-editable display name
- `avatar_url` text — user-editable avatar URL
- `role` user_role — NOT NULL, DEFAULT 'student'. NOT client-writable.
- `status` user_status — NOT NULL, DEFAULT 'active'. NOT client-writable.
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()

### instructor_profiles
One per user. Stores the instructor application data.
- `id` UUID PK DEFAULT gen_random_uuid()
- `user_id` UUID UNIQUE → references `profiles(id)` ON DELETE CASCADE
- `public_name` text — the instructor's public display name
- `professional_title` text — e.g. "Pénzügyi tanácsadó"
- `biography` text — short bio
- `experience` text — professional experience description
- `teaching_topics` text — comma-separated topics
- `website_url` text — optional
- `social_url` text — optional LinkedIn/social profile
- `application_message` text — "Why do you want to teach?"
- `approval_status` instructor_application_status — DEFAULT 'not_applied'. NOT client-writable.
- `rejection_reason` text — set by admin on rejection. NOT client-writable.
- `applied_at` timestamptz — set when application is submitted
- `reviewed_at` timestamptz — set by admin on approval/rejection. NOT client-writable.
- `reviewed_by` UUID — admin who reviewed. NOT client-writable.
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()

## 3. Triggers

### handle_new_user
AFTER INSERT on `auth.users` → creates a matching `profiles` row with role='student', status='active'.
Safely synchronizes email from the auth user's email.

### update_updated_at_columns
BEFORE UPDATE on `profiles` and `instructor_profiles` → sets `updated_at = now()`.

## 4. SECURITY DEFINER Functions

### approve_instructor_application(p_user_id UUID)
Called by an admin. Sets instructor_profiles.approval_status='approved', profiles.role='instructor',
stores reviewed_at and reviewed_by. Checks caller is admin via auth.uid().

### reject_instructor_application(p_user_id UUID, p_rejection_reason text)
Called by an admin. Sets instructor_profiles.approval_status='rejected', stores rejection_reason,
reviewed_at, reviewed_by. Does NOT change user role.

### suspend_user(p_user_id UUID)
Called by an admin. Sets profiles.status='suspended'. Checks caller is admin.

### reactivate_user(p_user_id UUID)
Called by an admin. Sets profiles.status='active'. Checks caller is admin.

## 5. Row Level Security

### profiles
- SELECT: authenticated users read their own profile. Admins read all profiles.
- UPDATE: authenticated users update ONLY full_name and avatar_url on their own profile.
  Column-level privileges revoke UPDATE on role, status, email, id, created_at, updated_at.
- No INSERT or DELETE policies (profiles are created by trigger only).

### instructor_profiles
- SELECT: users read their own application. Admins read all. Approved instructors' public fields are readable by authenticated users.
- INSERT: authenticated users create their own application (one per user).
- UPDATE: users update their own application only while pending or rejected.
  Column-level privileges revoke UPDATE on approval_status, rejection_reason, reviewed_by, reviewed_at.
- No DELETE policy (applications are permanent records).

## 6. Important Notes
1. Every new user automatically gets a profile with role='student' and status='active'.
2. Users CANNOT change their own role or status — those columns are revoked at the database level.
3. Instructor application approval/rejection happens ONLY through SECURITY DEFINER functions
   that verify the caller is an admin. The browser client cannot directly modify approval_status.
4. The service-role key is never exposed to the browser. All privileged operations go through
   SECURITY DEFINER functions that check auth.uid().
*/

-- ============================================================
-- 1. ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'instructor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('active', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE instructor_application_status AS ENUM ('not_applied', 'pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'student',
  status user_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instructor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  public_name TEXT NOT NULL,
  professional_title TEXT NOT NULL,
  biography TEXT NOT NULL,
  experience TEXT NOT NULL,
  teaching_topics TEXT NOT NULL,
  website_url TEXT,
  social_url TEXT,
  application_message TEXT NOT NULL,
  approval_status instructor_application_status NOT NULL DEFAULT 'not_applied',
  rejection_reason TEXT,
  applied_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by UUID REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_instructor_profiles_approval_status ON instructor_profiles(approval_status);

-- ============================================================
-- 4. TRIGGERS
-- ============================================================

-- Auto-create profile on new auth.user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_instructor_profiles_updated_at ON instructor_profiles;
CREATE TRIGGER update_instructor_profiles_updated_at
  BEFORE UPDATE ON instructor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. SECURITY DEFINER FUNCTIONS (admin-only operations)
-- ============================================================

-- Approve an instructor application
-- Security: checks that the CALLER (auth.uid()) is an admin. Never trusts a parameter for the caller identity.
CREATE OR REPLACE FUNCTION public.approve_instructor_application(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Nincs jogosultsága a művelet végrehajtásához.';
  END IF;

  -- Update instructor profile to approved
  UPDATE public.instructor_profiles
  SET approval_status = 'approved',
      reviewed_at = now(),
      reviewed_by = auth.uid(),
      rejection_reason = NULL
  WHERE user_id = p_user_id AND approval_status = 'pending';

  -- Promote user to instructor
  UPDATE public.profiles
  SET role = 'instructor'
  WHERE id = p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.approve_instructor_application(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.approve_instructor_application(UUID) TO authenticated;

-- Reject an instructor application
-- Security: checks that the CALLER (auth.uid()) is an admin. Never trusts a parameter for the caller identity.
CREATE OR REPLACE FUNCTION public.reject_instructor_application(p_user_id UUID, p_rejection_reason TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Verify the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Nincs jogosultsága a művelet végrehajtásához.';
  END IF;

  IF p_rejection_reason IS NULL OR trim(p_rejection_reason) = '' THEN
    RAISE EXCEPTION 'Az elutasítás indokának megadása kötelező.';
  END IF;

  -- Update instructor profile to rejected
  UPDATE public.instructor_profiles
  SET approval_status = 'rejected',
      rejection_reason = p_rejection_reason,
      reviewed_at = now(),
      reviewed_by = auth.uid()
  WHERE user_id = p_user_id AND approval_status = 'pending';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reject_instructor_application(UUID, TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.reject_instructor_application(UUID, TEXT) TO authenticated;

-- Suspend a user
-- Security: checks that the CALLER (auth.uid()) is an admin.
CREATE OR REPLACE FUNCTION public.suspend_user(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Nincs jogosultsága a művelet végrehajtásához.';
  END IF;

  UPDATE public.profiles
  SET status = 'suspended'
  WHERE id = p_user_id AND role != 'admin';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.suspend_user(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.suspend_user(UUID) TO authenticated;

-- Reactivate a user
-- Security: checks that the CALLER (auth.uid()) is an admin.
CREATE OR REPLACE FUNCTION public.reactivate_user(p_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Nincs jogosultsága a művelet végrehajtásához.';
  END IF;

  UPDATE public.profiles
  SET status = 'active'
  WHERE id = p_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.reactivate_user(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.reactivate_user(UUID) TO authenticated;

-- ============================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructor_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. PROFILES POLICIES
-- ============================================================

-- SELECT: users can read their own profile; admins can read all
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin" ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- UPDATE: users can update only their own profile (column privileges restrict which columns)
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Column-level: revoke UPDATE on privileged columns, grant only on safe ones
-- This prevents users from changing their own role, status, email, or audit fields
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, avatar_url) ON profiles TO authenticated;

-- ============================================================
-- 8. INSTRUCTOR_PROFILES POLICIES
-- ============================================================

-- SELECT: users read their own application; admins read all;
-- approved instructors' public fields are readable by authenticated users
DROP POLICY IF EXISTS "instructor_profiles_select_own_admin_or_approved" ON instructor_profiles;
CREATE POLICY "instructor_profiles_select_own_admin_or_approved" ON instructor_profiles FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
    OR (
      approval_status = 'approved'
      AND EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role IN ('student', 'instructor', 'admin')
      )
    )
  );

-- INSERT: authenticated users create their own application (one per user enforced by unique constraint)
DROP POLICY IF EXISTS "instructor_profiles_insert_own" ON instructor_profiles;
CREATE POLICY "instructor_profiles_insert_own" ON instructor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND approval_status = 'pending'
  );

-- UPDATE: users update their own application only while pending or rejected
-- Column privileges prevent changing approval_status, rejection_reason, reviewed_by, reviewed_at
DROP POLICY IF EXISTS "instructor_profiles_update_own_pending_or_rejected" ON instructor_profiles;
CREATE POLICY "instructor_profiles_update_own_pending_or_rejected" ON instructor_profiles FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    AND approval_status IN ('pending', 'rejected')
  )
  WITH CHECK (
    user_id = auth.uid()
    AND approval_status IN ('pending', 'rejected')
  );

-- Column-level: revoke UPDATE on privileged columns
-- Users can only edit: public_name, professional_title, biography, experience,
-- teaching_topics, website_url, social_url, application_message, applied_at
REVOKE UPDATE ON instructor_profiles FROM authenticated;
GRANT UPDATE (
  public_name, professional_title, biography, experience,
  teaching_topics, website_url, social_url, application_message, applied_at
) ON instructor_profiles TO authenticated;
