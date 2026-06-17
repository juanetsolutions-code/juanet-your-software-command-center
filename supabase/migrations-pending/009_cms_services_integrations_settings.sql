-- =====================================================================
-- 009_cms_services_integrations_settings.sql
-- Backs the remaining admin surfaces that were still on mock data:
--   • CMS pages          (admin/cms)
--   • Service plans &
--     tenant subs        (admin/services)
--   • Integrations       (admin/integrations)
--   • Tenant settings    (admin/settings/*)
--
-- Pattern matches earlier migrations: tenant-scoped, RLS on, explicit
-- GRANTs for authenticated + service_role, indexes on common filters.
-- Safe to re-run (IF NOT EXISTS everywhere).
-- =====================================================================

-- ---------- CMS pages -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  slug            text NOT NULL,
  title           text NOT NULL,
  path            text NOT NULL,
  status          text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  content         jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo             jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, slug)
);
CREATE INDEX IF NOT EXISTS cms_pages_org_idx       ON public.cms_pages(organization_id);
CREATE INDEX IF NOT EXISTS cms_pages_status_idx    ON public.cms_pages(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT ALL                            ON public.cms_pages TO service_role;
GRANT SELECT                         ON public.cms_pages TO anon; -- published marketing pages
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cms_pages_public_read_published" ON public.cms_pages
  FOR SELECT TO anon
  USING (status = 'published');

CREATE POLICY "cms_pages_org_read" ON public.cms_pages
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "cms_pages_admin_write" ON public.cms_pages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- ---------- Service plans (catalog) -----------------------------------
CREATE TABLE IF NOT EXISTS public.service_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text NOT NULL UNIQUE,
  name            text NOT NULL,
  description     text,
  price_cents     integer NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'USD',
  billing_period  text NOT NULL DEFAULT 'monthly' CHECK (billing_period IN ('monthly','yearly','one_time')),
  features        jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT                         ON public.service_plans TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE         ON public.service_plans TO authenticated;
GRANT ALL                            ON public.service_plans TO service_role;
ALTER TABLE public.service_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_plans_public_read" ON public.service_plans
  FOR SELECT USING (true);

CREATE POLICY "service_plans_admin_write" ON public.service_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- ---------- Tenant subscriptions --------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id         uuid REFERENCES public.service_plans(id) ON DELETE SET NULL,
  plan_code       text,
  status          text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','past_due','canceled','trialing','paused')),
  amount_cents    integer NOT NULL DEFAULT 0,
  currency        text NOT NULL DEFAULT 'USD',
  current_period_start timestamptz,
  current_period_end   timestamptz,
  renewal_at      timestamptz,
  canceled_at     timestamptz,
  external_ref    text,
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS subscriptions_org_idx     ON public.subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx  ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_renewal_idx ON public.subscriptions(renewal_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL                            ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_org_read" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'superadmin')
  );

CREATE POLICY "subscriptions_admin_write" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- ---------- Integrations ---------------------------------------------
CREATE TABLE IF NOT EXISTS public.integrations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider        text NOT NULL,                -- 'stripe' | 'mpesa' | 'github' | 'slack' | ...
  name            text NOT NULL,
  status          text NOT NULL DEFAULT 'disconnected'
                    CHECK (status IN ('connected','disconnected','error','pending')),
  config          jsonb NOT NULL DEFAULT '{}'::jsonb,    -- non-secret config
  secret_ref      text,                                 -- pointer to a secret store entry
  accounts_count  integer NOT NULL DEFAULT 0,
  last_sync_at    timestamptz,
  last_error      text,
  created_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, provider)
);
CREATE INDEX IF NOT EXISTS integrations_org_idx    ON public.integrations(organization_id);
CREATE INDEX IF NOT EXISTS integrations_status_idx ON public.integrations(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;
GRANT ALL                            ON public.integrations TO service_role;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "integrations_org_read" ON public.integrations
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "integrations_admin_write" ON public.integrations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- ---------- Tenant / workspace settings -------------------------------
CREATE TABLE IF NOT EXISTS public.tenant_settings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  category        text NOT NULL,                       -- 'branding' | 'notifications' | 'security' | 'api' | ...
  key             text NOT NULL,
  value           jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, category, key)
);
CREATE INDEX IF NOT EXISTS tenant_settings_org_idx ON public.tenant_settings(organization_id);
CREATE INDEX IF NOT EXISTS tenant_settings_cat_idx ON public.tenant_settings(category);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenant_settings TO authenticated;
GRANT ALL                            ON public.tenant_settings TO service_role;
ALTER TABLE public.tenant_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_settings_org_read" ON public.tenant_settings
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "tenant_settings_admin_write" ON public.tenant_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

-- ---------- updated_at triggers (idempotent) --------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_updated_at') THEN
    CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql AS $f$
    BEGIN NEW.updated_at = now(); RETURN NEW; END;
    $f$;
  END IF;
END $$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['cms_pages','service_plans','subscriptions','integrations','tenant_settings']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%I_updated_at ON public.%I;
       CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();',
      t, t, t, t
    );
  END LOOP;
END $$;
