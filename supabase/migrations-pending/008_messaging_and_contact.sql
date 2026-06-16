-- ============================================================
-- 008: Messaging (conversations + messages) and Contact Inbox
-- Apply AFTER 002–007.
-- Transport-layer secure (HTTPS + RLS); plaintext bodies stored.
-- ============================================================

-- ---------- conversations ----------
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  subject text NOT NULL DEFAULT 'New conversation',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- ---------- conversation participants ----------
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  last_read_at timestamptz,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (conversation_id, user_id)
);

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

CREATE POLICY "participants can read conversation"
  ON public.conversations FOR SELECT TO authenticated
  USING (public.is_conversation_participant(id, auth.uid()));

CREATE POLICY "users create own conversation"
  ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "creator can update conversation"
  ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "participants can read participants"
  ON public.conversation_participants FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "creator adds participants"
  ON public.conversation_participants FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id AND c.created_by = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "self can update last_read"
  ON public.conversation_participants FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ---------- messages ----------
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participants read messages"
  ON public.messages FOR SELECT TO authenticated
  USING (public.is_conversation_participant(conversation_id, auth.uid()));

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

-- Anyone (including anon) can submit the public contact form
CREATE POLICY "public can submit contact form"
  ON public.contact_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "admins read contact submissions"
  ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "admins update contact submissions"
  ON public.contact_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "admins delete contact submissions"
  ON public.contact_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'superadmin'));
