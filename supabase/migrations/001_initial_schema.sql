-- =====================================================================
-- Juanet – Software Command Center
-- Supabase Initial Schema Migration
-- File: 001_initial_schema.sql
--
-- PURPOSE:
--   Production-ready foundation for multi-tenant SaaS with Row Level
--   Security (RLS). All tables are isolated per authenticated user via
--   user_id = auth.uid().
--
--   This migration is READ-ONLY infrastructure. No writes are performed
--   from the application yet. Existing mock fallback remains intact.
--
--   Compatible with current repository layer querying "projects" and
--   "requests" tables directly.
--
-- IMPORTANT:
--   - Run this migration BEFORE enabling real writes.
--   - Never remove the mock fallback until RLS + repositories are proven.
--   - All future CRUD will respect these RLS policies.
--
-- FUTURE EXPANSION POINTS (marked throughout):
--   - Teams / Organizations (multi-org SaaS)
--   - Notifications system
--   - Audit logging table
--   - File attachments / storage
--   - Role-based access beyond owner (admin/staff delegation)
-- =====================================================================

-- Enable required extensions (Supabase usually has these, but explicit is safe)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- fallback uuid generator

-- =====================================================================
-- 1. Reusable trigger function for automatic updated_at maintenance
-- =====================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS
  'Trigger function that automatically sets updated_at = NOW() on row update.
   Applied to every table that has an updated_at column.';

-- =====================================================================
-- 2. Core tables
--    Every table follows the same ownership pattern:
--      id (PK), created_at, updated_at, user_id (FK -> auth.users)
--    This enables simple, consistent RLS policies: auth.uid() = user_id
-- =====================================================================

-- ---------------------------------------------------------------------
-- profiles
-- One row per authenticated user. Auto-created on signup via trigger.
-- FUTURE: Add organization_id, preferences JSONB, last_login_at, etc.
-- ---------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT only for now (writes will be added later with INSERT/UPDATE policies)
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.profiles IS
  'User profile data. Linked 1:1 with auth.users. RLS enforces owner-only access.
   FUTURE: Extend for teams/organizations by adding organization_id + membership table.';

-- ---------------------------------------------------------------------
-- projects
-- Matches current repository expectations: title, status, progress, etc.
-- ---------------------------------------------------------------------
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_own"
  ON public.projects
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.projects IS
  'Client projects. RLS: only the owning user can read their rows.
   FUTURE: Add lead_profile_id, owner_profile_id, organization_id, due_at, category.';

-- ---------------------------------------------------------------------
-- requests (service requests)
-- Current repositories query "requests" table with subject, category, status.
-- ---------------------------------------------------------------------
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  subject TEXT NOT NULL,
  category TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_user_id ON public.requests(user_id);
CREATE INDEX idx_requests_status ON public.requests(status);

CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "requests_select_own"
  ON public.requests
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.requests IS
  'Service requests / support tickets submitted by users.
   FUTURE: Add description, budget_range, timeline, deadline_at, assigned_to, attachments.';

-- ---------------------------------------------------------------------
-- messages
-- Simple messaging table for the communications module.
-- ---------------------------------------------------------------------
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_read ON public.messages(read);

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own"
  ON public.messages
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.messages IS
  'User messages / notifications. RLS owner-only.
   FUTURE: Link to conversations, add sender/recipient, attachments, thread support.';

-- ---------------------------------------------------------------------
-- invoices
-- ---------------------------------------------------------------------
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  invoice_number TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_own"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.invoices IS
  'Billing invoices. RLS owner-only.
   FUTURE: Add project_id FK, line items JSONB, tax, currency, PDF storage reference.';

-- ---------------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------------
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  provider TEXT,                    -- 'stripe', 'mpesa', 'manual', etc.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  transaction_reference TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.payments IS
  'Payment records linked to invoices (future FK).
   FUTURE: Add invoice_id, payment_method_id, processor fees, receipt_url.';

-- =====================================================================
-- 3. Profile auto-creation trigger
--    When a user signs up via Supabase Auth, automatically create
--    a corresponding profile row with default role 'user'.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;   -- idempotent in case of retries
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS
  'Automatically provisions a profile row for every new auth.users record.
   Runs as SECURITY DEFINER so it can write to profiles even when RLS is active.';

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 4. Recommended Supabase project settings (documented here for ops)
--    - Enable Email + Google providers in Auth settings
--    - Set Site URL and redirect URLs correctly
--    - Turn on "Confirm email" for production
--    - Enable Row Level Security on every new table by default
-- =====================================================================

-- End of 001_initial_schema.sql
-- All tables are now RLS-protected and ready for safe multi-user access.
-- Next migration can safely add FKs, more columns, or write policies.
