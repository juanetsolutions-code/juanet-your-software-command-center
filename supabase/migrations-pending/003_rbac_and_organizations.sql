-- =====================================================================
-- 003_rbac_and_organizations.sql
-- Adds:
--   * app_role enum + user_roles table (secure RBAC, never on profiles)
--   * has_role() security-definer helper for RLS
--   * organizations + organization_members (multi-tenant foundation)
--   * workspaces (sub-tenant inside an org)
-- =====================================================================

CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'staff', 'user');

CREATE TABLE public.user_roles (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role    public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL    ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- ---------------------------------------------------------------------
-- organizations + members
-- ---------------------------------------------------------------------
CREATE TABLE public.organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE,
  plan       TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','pro','enterprise')),
  owner_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.organization_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org  ON public.organization_members(organization_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organizations        TO service_role;
GRANT ALL ON public.organization_members TO service_role;

ALTER TABLE public.organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_org_member(_user_id UUID, _org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = _user_id AND organization_id = _org_id
  );
$$;

CREATE POLICY "orgs_select_member" ON public.organizations
  FOR SELECT TO authenticated
  USING (public.is_org_member(auth.uid(), id) OR owner_id = auth.uid());

CREATE POLICY "orgs_insert_self_owner" ON public.organizations
  FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "orgs_update_owner" ON public.organizations
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "org_members_select_own_or_org" ON public.organization_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_org_member(auth.uid(), organization_id));

CREATE POLICY "org_members_insert_owner" ON public.organization_members
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_id AND o.owner_id = auth.uid()
  ));

CREATE POLICY "org_members_delete_owner" ON public.organization_members
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.organizations o
    WHERE o.id = organization_id AND o.owner_id = auth.uid()
  ));

-- ---------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------
CREATE TABLE public.workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (organization_id, slug)
);
CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workspaces TO authenticated;
GRANT ALL ON public.workspaces TO service_role;

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workspaces_org_scope" ON public.workspaces
  FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
