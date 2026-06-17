-- ============================================================
-- 008: Messaging (conversations + messages) and Contact Inbox
-- Defensive / idempotent: safe to re-run after partial failures
-- or against pre-existing `messages` tables from earlier schemas.
-- Transport-layer secure (HTTPS + RLS); plaintext bodies stored.
-- ============================================================

-- ---------- conversations ----------
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid,
  subject text NOT NULL DEFAULT 'New conversation',
  created_by uuid NOT NULL,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Patch older variants
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS organization_id uuid;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS subject text NOT NULL DEFAULT 'New conversation';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_message_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ---------- conversation participants ----------
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  last_read_at timestamptz,
  joined_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS conversation_id uuid;
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'member';
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS last_read_at timestamptz;
ALTER TABLE public.conversation_participants ADD COLUMN IF NOT EXISTS joined_at timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  ALTER TABLE public.conversation_participants
    ADD CONSTRAINT conversation_participants_unique UNIQUE (conversation_id, user_id);
EXCEPTION WHEN duplicate_table OR duplicate_object THEN NULL; END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_participants TO authenticated;
GRANT ALL ON public.conversation_participants TO service_role;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- helper: is the current user a participant?
CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conversation_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = _conversation_id AND user_id = _user_id
  );
$$;

DROP POLICY IF EXISTS "participants can read conversation" ON public.conversations;
CREATE POLICY "participants can read conversation"
  ON public.conversations FOR SELECT TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));

DROP POLICY IF EXISTS "users create own conversation" ON public.conversations;
CREATE POLICY "users create own conversation"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "creator can update conversation" ON public.conversations;
CREATE POLICY "creator can update conversation"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "participants can read participants" ON public.conversation_participants;
CREATE POLICY "participants can read participants"
  ON public.conversation_participants FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "creator adds participants" ON public.conversation_participants;
CREATE POLICY "creator adds participants"
  ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "self can update last_read" ON public.conversation_participants;
CREATE POLICY "self can update last_read"
  ON public.conversation_participants FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ---------- messages ----------
-- An older `messages` table from a prior schema (without conversation_id)
-- may already exist. Patch it idempotently.
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid,
  body text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS conversation_id uuid;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS sender_id uuid;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS body text;
-- Some older schemas used `content` instead of `body` — backfill body from it.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='messages' AND column_name='content'
  ) THEN
    EXECUTE 'UPDATE public.messages SET body = COALESCE(body, content) WHERE body IS NULL';
  END IF;
END $$;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON public.messages(conversation_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participants read messages" ON public.messages;
CREATE POLICY "participants read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "participants send messages" ON public.messages;
CREATE POLICY "participants send messages"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    public.is_conversation_participant(conversation_id, auth.uid())
  );

-- ---------- contact submissions (public form) ----------
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_review','responded','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public can submit contact form" ON public.contact_submissions;
CREATE POLICY "public can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admins read contact submissions" ON public.contact_submissions;
CREATE POLICY "admins read contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

DROP POLICY IF EXISTS "admins update contact submissions" ON public.contact_submissions;
CREATE POLICY "admins update contact submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

DROP POLICY IF EXISTS "admins delete contact submissions" ON public.contact_submissions;
CREATE POLICY "admins delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
