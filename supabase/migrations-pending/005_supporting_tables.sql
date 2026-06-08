-- =====================================================================
-- 005_supporting_tables.sql
-- Adds the remaining tables the repository layer references:
--   conversations, conversation_members, payment_methods,
--   activity_logs, notifications, automations, automation_runs,
--   audit_events.
-- Requires 003 (organizations + helpers).
-- =====================================================================

CREATE TABLE public.conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  title           TEXT,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_conversations_org ON public.conversations(organization_id);
CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON public.conversations FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.conversation_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (conversation_id, user_id)
);
CREATE INDEX idx_conv_members_user ON public.conversation_members(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_members TO authenticated;
GRANT ALL ON public.conversations        TO service_role;
GRANT ALL ON public.conversation_members TO service_role;

ALTER TABLE public.conversations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_conversation_member(_user_id UUID, _conv_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = _conv_id AND user_id = _user_id
  );
$$;

CREATE POLICY "conversations_member_access" ON public.conversations FOR ALL TO authenticated
  USING (public.is_conversation_member(auth.uid(), id) OR created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "conv_members_self" ON public.conversation_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_conversation_member(auth.uid(), conversation_id));

CREATE POLICY "conv_members_join_self" ON public.conversation_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- payment_methods
-- ---------------------------------------------------------------------
CREATE TABLE public.payment_methods (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider    TEXT NOT NULL,
  type        TEXT,
  label       TEXT,
  last4       TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payment_methods_user ON public.payment_methods(user_id);
CREATE TRIGGER trg_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_methods_own" ON public.payment_methods FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- activity_logs
-- ---------------------------------------------------------------------
CREATE TABLE public.activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  entity_type     TEXT,
  entity_id       UUID,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activity_logs_org  ON public.activity_logs(organization_id);
CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);

GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_logs_org_or_own" ON public.activity_logs FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR (organization_id IS NOT NULL AND public.is_org_member(auth.uid(), organization_id))
  );
CREATE POLICY "activity_logs_insert_self" ON public.activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- ---------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------
CREATE TABLE public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  category    TEXT,
  priority    TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  link        TEXT,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_own" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- automations + runs
-- ---------------------------------------------------------------------
CREATE TABLE public.automations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  trigger         JSONB NOT NULL DEFAULT '{}',
  steps           JSONB NOT NULL DEFAULT '[]',
  enabled         BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_automations_org ON public.automations(organization_id);
CREATE TRIGGER trg_automations_updated_at
  BEFORE UPDATE ON public.automations FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.automation_runs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id   UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','running','succeeded','failed','cancelled')),
  variables       JSONB NOT NULL DEFAULT '{}',
  error           TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at     TIMESTAMPTZ
);
CREATE INDEX idx_automation_runs_org    ON public.automation_runs(organization_id);
CREATE INDEX idx_automation_runs_status ON public.automation_runs(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.automations    TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON public.automation_runs TO authenticated;
GRANT ALL ON public.automations     TO service_role;
GRANT ALL ON public.automation_runs TO service_role;

ALTER TABLE public.automations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "automations_org" ON public.automations FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));

CREATE POLICY "automation_runs_org" ON public.automation_runs FOR ALL TO authenticated
  USING (public.is_org_member(auth.uid(), organization_id))
  WITH CHECK (public.is_org_member(auth.uid(), organization_id));

-- ---------------------------------------------------------------------
-- audit_events (security / governance trail)
-- ---------------------------------------------------------------------
CREATE TABLE public.audit_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  resource_type   TEXT,
  resource_id     UUID,
  ip_address      TEXT,
  user_agent      TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_events_org    ON public.audit_events(organization_id);
CREATE INDEX idx_audit_events_actor  ON public.audit_events(actor_id);
CREATE INDEX idx_audit_events_action ON public.audit_events(action);

GRANT SELECT, INSERT ON public.audit_events TO authenticated;
GRANT ALL ON public.audit_events TO service_role;

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_events_read_admin" ON public.audit_events FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'superadmin')
    OR (organization_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.organization_members m
      WHERE m.organization_id = audit_events.organization_id
        AND m.user_id = auth.uid()
        AND m.role IN ('owner','admin')
    ))
  );

CREATE POLICY "audit_events_insert_self" ON public.audit_events FOR INSERT TO authenticated
  WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);
