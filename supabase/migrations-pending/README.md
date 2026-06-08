# Pending Migrations

These SQL files extend `001_initial_schema.sql` to match the current state of the application code (RBAC, organizations, CRM, conversations, automations, audit, etc.).

Lovable Cloud is not enabled on this project, so they are NOT auto-applied. Run them manually in the Supabase SQL editor **in order**:

1. `002_write_policies_and_grants.sql` — adds missing GRANTs + INSERT/UPDATE/DELETE policies for the tables in 001
2. `003_rbac_and_organizations.sql` — `user_roles` (secure RBAC), `has_role()`, organizations, organization_members, workspaces
3. `004_crm_module.sql` — leads, accounts, contacts, pipelines, stages, deals, activities
4. `005_supporting_tables.sql` — conversations, conversation_members, payment_methods, activity_logs, notifications, automations, automation_runs, audit_events

Each file is idempotent-friendly within itself but **assumes the previous one has been applied**. All new tables are RLS-enabled and granted to `authenticated` + `service_role` per Lovable security policy.

> When you're ready to switch from mock mode to live data, also set `VITE_DATA_MODE=hybrid` (or `full`) in `.env`.
