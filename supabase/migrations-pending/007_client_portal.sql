-- =====================================================================
-- 007 — Client portal extras
-- Adds tables the client dashboard needs:
--   * api_tokens         — personal API tokens (Dashboard › API Access)
--   * downloads          — file catalogue (Dashboard › Downloads)
--   * download_grants    — per-user / per-org access grants
-- Extends existing tables with columns the UI references:
--   * requests   : description, budget_range, timeline, deadline_at, service_slug
--   * invoices   : project_id (FK), currency, project_name
--   * projects   : category, due_at, lead_name
-- Run AFTER 001–006.
-- =====================================================================

-- ---------------------------------------------------------------------
-- projects: add display columns the dashboard renders
-- ---------------------------------------------------------------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS category   TEXT,
  ADD COLUMN IF NOT EXISTS due_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS lead_name  TEXT;

-- Allow owners to insert/update/delete their own projects (read policy exists).
DO $$ BEGIN
  CREATE POLICY "projects_insert_own" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "projects_update_own" ON public.projects
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "projects_delete_own" ON public.projects
    FOR DELETE TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- requests: extend for full service-request form
-- ---------------------------------------------------------------------
ALTER TABLE public.requests
  ADD COLUMN IF NOT EXISTS description   TEXT,
  ADD COLUMN IF NOT EXISTS budget_range  TEXT,
  ADD COLUMN IF NOT EXISTS timeline      TEXT,
  ADD COLUMN IF NOT EXISTS deadline_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS service_slug  TEXT;

-- ---------------------------------------------------------------------
-- invoices: link to projects, currency, display name
-- ---------------------------------------------------------------------
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS project_id    UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS currency      TEXT NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS project_name  TEXT;

-- ---------------------------------------------------------------------
-- api_tokens — personal access tokens
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.api_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  token_prefix TEXT NOT NULL,           -- e.g. "jnt_live_"
  token_hash  TEXT NOT NULL,            -- store only the hash
  last_four   TEXT NOT NULL,            -- for display
  last_used_at TIMESTAMPTZ,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_tokens_user ON public.api_tokens(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_tokens TO authenticated;
GRANT ALL ON public.api_tokens TO service_role;

ALTER TABLE public.api_tokens ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "api_tokens_own" ON public.api_tokens
    FOR ALL TO authenticated
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- downloads — catalogue of installers / SDKs / assets
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.downloads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  kind            TEXT NOT NULL DEFAULT 'installer'
                    CHECK (kind IN ('installer','library','asset','document','sdk','other')),
  version         TEXT,
  size_bytes      BIGINT NOT NULL DEFAULT 0,
  url             TEXT NOT NULL,
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_downloads_org ON public.downloads(organization_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "downloads_public_read" ON public.downloads
    FOR SELECT TO authenticated
    USING (is_public OR (organization_id IS NOT NULL
           AND public.is_org_member(auth.uid(), organization_id)));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "downloads_org_write" ON public.downloads
    FOR ALL TO authenticated
    USING (organization_id IS NOT NULL
           AND public.is_org_member(auth.uid(), organization_id))
    WITH CHECK (organization_id IS NOT NULL
                AND public.is_org_member(auth.uid(), organization_id));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------------------------------------------------------------------
-- billing_addresses — single row per user
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.billing_addresses (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT,
  region      TEXT,
  postal_code TEXT,
  country     TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.billing_addresses TO authenticated;
GRANT ALL ON public.billing_addresses TO service_role;
ALTER TABLE public.billing_addresses ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "billing_addresses_own" ON public.billing_addresses
    FOR ALL TO authenticated
    USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
