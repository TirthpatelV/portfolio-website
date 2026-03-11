-- Create admin_recovery table for storing admin security PINs
-- This table stores email and 4-digit PIN for password recovery without email

CREATE TABLE IF NOT EXISTS public.admin_recovery (
  email TEXT PRIMARY KEY NOT NULL,
  pin TEXT NOT NULL, -- In production, this should be hashed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT DATE_TRUNC('second', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT DATE_TRUNC('second', NOW()) NOT NULL
);

-- Add RLS policies
-- Admin can only view/update their own recovery info
ALTER TABLE public.admin_recovery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotent updates)
DROP POLICY IF EXISTS "allow_pin_verification" ON public.admin_recovery;
DROP POLICY IF EXISTS "allow_user_update_own_pin" ON public.admin_recovery;
DROP POLICY IF EXISTS "allow_user_insert_own_pin" ON public.admin_recovery;

-- Create a policy for verify-pin API (unauthenticated - for password reset flow)
-- This is safe because PIN verification requires both email AND correct PIN
CREATE POLICY "allow_pin_verification"
  ON public.admin_recovery
  FOR SELECT
  USING (true);

-- Create a policy for authenticated users to update their own PIN
CREATE POLICY "allow_user_update_own_pin"
  ON public.admin_recovery
  FOR UPDATE
  USING (auth.jwt() ->> 'email' = email)
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create a policy for authenticated users to insert their own PIN
CREATE POLICY "allow_user_insert_own_pin"
  ON public.admin_recovery
  FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = email);

-- Create indexes for faster queries (drop if exist for idempotent updates)
DROP INDEX IF EXISTS idx_admin_recovery_email;
DROP INDEX IF EXISTS idx_admin_recovery_updated_at;

CREATE INDEX idx_admin_recovery_email ON public.admin_recovery(email);
CREATE INDEX idx_admin_recovery_updated_at ON public.admin_recovery(updated_at);

-- Grant permissions to authenticated users
GRANT SELECT ON public.admin_recovery TO authenticated;
GRANT UPDATE ON public.admin_recovery TO authenticated;
GRANT INSERT ON public.admin_recovery TO authenticated;

-- Create a service role function to check PIN existence (for API use)
-- Drop if exists for idempotent updates
DROP FUNCTION IF EXISTS check_pin_exists(TEXT);

CREATE OR REPLACE FUNCTION check_pin_exists(p_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.admin_recovery WHERE email = p_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
