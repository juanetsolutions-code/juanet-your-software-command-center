-- =====================================================================
-- 002_write_policies_and_grants.sql
-- Adds the missing GRANTs (PostgREST requires explicit grants) and
-- INSERT/UPDATE/DELETE policies for the tables created in 001.
-- Every policy keeps the same ownership rule: auth.uid() = user_id.
-- =====================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.requests  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments  TO authenticated;

GRANT ALL ON public.profiles  TO service_role;
GRANT ALL ON public.projects  TO service_role;
GRANT ALL ON public.requests  TO service_role;
GRANT ALL ON public.messages  TO service_role;
GRANT ALL ON public.invoices  TO service_role;
GRANT ALL ON public.payments  TO service_role;

-- profiles: users can insert/update their own profile (no DELETE)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- projects: full CRUD on own rows
CREATE POLICY "projects_insert_own" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- requests
CREATE POLICY "requests_insert_own" ON public.requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "requests_update_own" ON public.requests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "requests_delete_own" ON public.requests
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- messages
CREATE POLICY "messages_insert_own" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "messages_update_own" ON public.messages
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "messages_delete_own" ON public.messages
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- invoices / payments (writes typically server-side; owner allowed for now)
CREATE POLICY "invoices_insert_own" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "invoices_update_own" ON public.invoices
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payments_insert_own" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "payments_update_own" ON public.payments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
