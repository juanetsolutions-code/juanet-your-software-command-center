-- =====================================================================
-- 004_crm_module.sql
-- Persistent CRM tables matching src/lib/crm/core/crm-entities.ts:
--   leads, accounts, contacts, pipelines, pipeline_stages,
--   deals, activities. All rows are scoped by organization_id.
-- Requires 003 (organizations + is_org_member()).
-- =====================================================================

CREATE TABLE public.crm_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  company         TEXT,
  title           TEXT,
  source          TEXT NOT NULL DEFAULT 'manual',
  status          TEXT NOT NULL DEFAULT 'new',
  score           INTEGER DEFAULT 0,
  value           NUMERIC(12,2),
  assigned_to     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tags            TEXT[] NOT NULL DEFAULT '{}',
  last_contacted_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_leads_org    ON public.crm_leads(organization_id);
CREATE INDEX idx_crm_leads_status ON public.crm_leads(status);
CREATE TRIGGER trg_crm_leads_updated_at
  BEFORE UPDATE ON public.crm_leads FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'customer',
  industry        TEXT,
  website         TEXT,
  phone           TEXT,
  address         TEXT,
  number_of_employees INTEGER,
  annual_revenue  NUMERIC(14,2),
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_accounts_org ON public.crm_accounts(organization_id);
CREATE TRIGGER trg_crm_accounts_updated_at
  BEFORE UPDATE ON public.crm_accounts FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id         UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  account_id      UUID REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  title           TEXT,
  type            TEXT NOT NULL DEFAULT 'primary',
  description     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_contacts_org ON public.crm_contacts(organization_id);
CREATE TRIGGER trg_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_pipelines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_pipelines_org ON public.crm_pipelines(organization_id);

CREATE TABLE public.crm_pipeline_stages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.crm_pipelines(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  position    INTEGER NOT NULL,
  probability INTEGER NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  color       TEXT
);
CREATE INDEX idx_crm_stages_pipeline ON public.crm_pipeline_stages(pipeline_id);

CREATE TABLE public.crm_deals (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id     UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  pipeline_id         UUID NOT NULL REFERENCES public.crm_pipelines(id) ON DELETE RESTRICT,
  lead_id             UUID REFERENCES public.crm_leads(id)    ON DELETE SET NULL,
  contact_id          UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  account_id          UUID REFERENCES public.crm_accounts(id) ON DELETE SET NULL,
  name                TEXT NOT NULL,
  description         TEXT,
  value               NUMERIC(12,2) NOT NULL DEFAULT 0,
  stage               TEXT NOT NULL DEFAULT 'qualification',
  priority            TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  probability         INTEGER NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date TIMESTAMPTZ,
  actual_close_date   TIMESTAMPTZ,
  assigned_to         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_deals_org   ON public.crm_deals(organization_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage);
CREATE TRIGGER trg_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_activities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('lead','contact','account','deal')),
  entity_id       UUID NOT NULL,
  type            TEXT NOT NULL,
  subject         TEXT NOT NULL,
  description     TEXT,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration        INTEGER,
  outcome         TEXT,
  scheduled_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_crm_activities_org    ON public.crm_activities(organization_id);
CREATE INDEX idx_crm_activities_entity ON public.crm_activities(entity_type, entity_id);

-- GRANTS + RLS for all CRM tables
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'crm_leads','crm_accounts','crm_contacts',
    'crm_pipelines','crm_pipeline_stages',
    'crm_deals','crm_activities'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

CREATE POLICY "crm_leads_org"      ON public.crm_leads      FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "crm_accounts_org"   ON public.crm_accounts   FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "crm_contacts_org"   ON public.crm_contacts   FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "crm_pipelines_org"  ON public.crm_pipelines  FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "crm_deals_org"      ON public.crm_deals      FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));
CREATE POLICY "crm_activities_org" ON public.crm_activities FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));

CREATE POLICY "crm_stages_via_pipeline" ON public.crm_pipeline_stages FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.crm_pipelines p
    WHERE p.id = pipeline_id AND public.is_org_member(auth.uid(), p.organization_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.crm_pipelines p
    WHERE p.id = pipeline_id AND public.is_org_member(auth.uid(), p.organization_id)
  ));
