-- Security Fixes for EU Savings Bank Map
-- Run Step 1 in Supabase SQL Editor BEFORE deploying frontend.
-- Run Step 2 AFTER verifying the frontend works.

-- ============================================================
-- STEP 1: Create check_admin_status RPC (additive — nothing breaks)
-- ============================================================

-- This function takes an email parameter (unlike is_admin() which uses JWT).
-- Needed for the pre-auth admin check in sendMagicLink.
CREATE OR REPLACE FUNCTION public.check_admin_status(check_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE email = lower(trim(check_email))
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_admin_status(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_admin_status(text) TO authenticated;

-- ============================================================
-- STEP 2 (optional): Tighten existing policies
-- The existing is_admin() + RLS policies from rls_policies_fix.sql
-- are already solid. These are additional hardening measures.
-- ============================================================

-- Rate limit bank inserts (if public submission is ever added)
-- Currently banks are admin-only, so this is a safety net.
-- Uncomment if needed:
--
-- DROP POLICY IF EXISTS "Rate limited public insert" ON banks;
-- CREATE POLICY "Rate limited public insert" ON banks
--   FOR INSERT WITH CHECK (
--     status = 'draft'
--     AND (SELECT count(*) FROM banks
--          WHERE created_at > now() - interval '1 hour'
--          AND status = 'draft') < 50
--   );
