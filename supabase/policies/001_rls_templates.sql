-- RLS Policy Templates for Juanet Multi-Tenant SaaS
-- DO NOT RUN AUTOMATICALLY — review and apply per environment
-- These are safe starting templates supporting:
--   - superadmin bypass (via JWT claim or role)
--   - organization isolation via organization_id
--   - owner / member separation

-- Enable RLS (run once)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Helper: is_superadmin()
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT (auth.jwt() ->> 'role') = 'superadmin' OR (auth.jwt() ->> 'user_role') = 'superadmin';
$$;

-- PROFILES
CREATE POLICY "profiles_select_own_or_org"
  ON public.profiles FOR SELECT
  USING (
    id = auth.uid() OR
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()) OR
    public.is_superadmin()
  );

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_superadmin());

-- ORGANIZATIONS
CREATE POLICY "orgs_select_member_or_super"
  ON public.organizations FOR SELECT
  USING (
    public.is_superadmin() OR
    EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = organizations.id AND profile_id = auth.uid()
    )
  );

CREATE POLICY "orgs_insert_owner"
  ON public.organizations FOR INSERT
  WITH CHECK (public.is_superadmin());

-- ORGANIZATION_MEMBERS
CREATE POLICY "org_members_select_own_org"
  ON public.organization_members FOR SELECT
  USING (
    public.is_superadmin() OR
    profile_id = auth.uid() OR
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE profile_id = auth.uid())
  );

-- PROJECTS (example tenant table)
CREATE POLICY "projects_org_isolation"
  ON public.projects FOR ALL
  USING (
    public.is_superadmin() OR
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE profile_id = auth.uid())
  )
  WITH CHECK (
    public.is_superadmin() OR
    organization_id IN (SELECT organization_id FROM public.organization_members WHERE profile_id = auth.uid())
  );

-- Repeat similar patterns for:
-- requests, messages, invoices, payments, workspaces, workspace_members

-- WORKSPACES
CREATE POLICY "workspaces_org_isolation"
  ON public.workspaces FOR ALL
  USING (public.is_superadmin() OR organization_id IN (...));

-- MESSAGES example
CREATE POLICY "messages_org_isolation"
  ON public.messages FOR ALL
  USING (public.is_superadmin() OR organization_id IN (...));

-- Add more as tables are created. Always test with service_role vs anon.
