# Backend Architecture — Phase: Real DB Foundation + Multi-Tenant Prep

This phase adds the architectural scaffolding for production Supabase
integration without changing UI behavior or removing mock fallback.

## What was added

### 1. Centralized Supabase query helpers
- `src/lib/supabase/safe-query.ts`
  - `runSafe`, `safeSelect`, `safeSelectFrom`, `safeInsert`, `safeUpdate`,
    `safeSingle`, `handleSupabaseError`
  - Repositories should migrate to these for uniform error handling.

### 2. Profile system
- `src/lib/auth/profile.ts`
  - `resolveProfile(user)` — pulls `profiles` row, merges with auth user.
  - Cached per session; falls back to `user_metadata` if table/row missing.
- `src/lib/auth/session.ts`
  - `mapSession` (sync, metadata) kept for first paint.
  - `mapSessionAsync` (profile-aware) wired into the auth store so the
    session is upgraded transparently after login / session restore.

### 3. Multi-tenant foundation
- `src/lib/tenant/types.ts`
  - `Organization`, `OrganizationMembership`, `DbOrganization`,
    `DbOrganizationMember`.
- `src/lib/tenant/context.ts`
  - `getCurrentOrganization()`, `requireOrganization()`,
    `clearOrganizationCache()`
  - `scopedQuery(q)`, `scopedSelect(client, table)` — apply
    `organization_id` filter when present.

### 4. Schema v2 (production-ready foundation)
- `src/lib/supabase/schema-v2.ts`
  - `TABLES_V2` adds `organizations`, `organization_members`.
  - `STATUS_ENUMS` consolidates project / request / invoice / payment /
    currency / org role / org plan enums.
  - `TenantBaseColumns` / `WithTenant<T>` for consistent tenant columns
    (`organization_id`, `created_by`, `created_at`, `updated_at`).

## What was NOT changed (by design)

- UI components, layout, styling.
- Existing repository function signatures (Projects, Requests, Messages,
  Invoices, Payments still match `src/lib/dashboard/api.ts`).
- Mock fallback behavior — all repositories continue to return mock data
  when `SUPABASE_READY` is false or when a query fails.
- RLS — not enforced yet; tenant helpers are advisory until tables exist.

## Next steps (when ready)

1. Create real Postgres tables matching `schema-v2.ts`
   (organizations, organization_members, profiles, projects with
   `organization_id`, etc.). Use the user-roles + `has_role()` pattern
   for RLS.
2. Update each repository to call `scopedSelect(...)` and `safeSelectFrom`.
3. Replace synthetic org in `getCurrentOrganization()` with a real
   membership lookup.
4. Promote `api.ts` callers to async (React Query) without changing prop
   shapes.
