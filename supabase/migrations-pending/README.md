# Pending Migrations

These SQL files extend `001_initial_schema.sql` to match the current state of the application code (RBAC, organizations, CRM, conversations, automations, audit, etc.).

Lovable Cloud is not enabled on this project, so they are NOT auto-applied. Run them manually in the Supabase SQL editor **in order**:

1. `002_write_policies_and_grants.sql` — adds missing GRANTs + INSERT/UPDATE/DELETE policies for the tables in 001
2. `003_rbac_and_organizations.sql` — `user_roles` (secure RBAC), `has_role()`, organizations, organization_members, workspaces
3. `004_crm_module.sql` — leads, accounts, contacts, pipelines, stages, deals, activities
4. `005_supporting_tables.sql` — conversations, conversation_members, payment_methods, activity_logs, notifications, automations, automation_runs, audit_events
5. `006_admin_ops.sql` — products, orders, order_items, licenses, support_tickets, ticket_messages
6. `007_client_portal.sql` — api_tokens, downloads, billing_addresses; extends `projects` / `requests` / `invoices` with display columns the client dashboard renders

Each file is idempotent-friendly within itself but **assumes the previous one has been applied**. All new tables are RLS-enabled and granted to `authenticated` + `service_role` per Lovable security policy.

> When you're ready to switch from mock mode to live data, also set `VITE_DATA_MODE=hybrid` (or `full`) in `.env`.

## 008_messaging_and_contact.sql
- `conversations`, `conversation_participants`, `messages` (with RLS via `is_conversation_participant`).
- `contact_submissions` for the public marketing contact form (anon INSERT, admin SELECT/UPDATE/DELETE).

## 009_cms_services_integrations_settings.sql
Backs the last admin surfaces that were still on mock data:
- `cms_pages` — marketing/CMS pages (anon SELECT for `status='published'`, admin write).
- `service_plans` + `subscriptions` — plan catalog and per-tenant subscriptions for admin/services.
- `integrations` — connected providers (Stripe, M-Pesa, GitHub, Slack, …) per organization.
- `tenant_settings` — generic key/value settings used by admin/settings/* (branding, notifications, security, api).

All tenant-scoped, RLS on, GRANTs for `authenticated` + `service_role`, plus shared `set_updated_at` trigger.
