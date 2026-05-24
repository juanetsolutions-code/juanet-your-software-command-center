# Database Migrations

This directory contains all Supabase/Postgres migrations for Juanet.

## Naming Convention

Use timestamp-based naming for new migrations:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Example:
- `20260523102200_add_organization_plan_column.sql`
- `20260524093015_create_audit_logs_table.sql`

Legacy numbered files (001_*) are kept for historical reasons.

## Structure & Best Practices

- Each file should be **idempotent** where possible.
- Include comments at the top explaining:
  - Purpose
  - Affected tables
  - Rollback strategy (if non-trivial)
- Add `DOWN` migration notes in comments when the change is destructive.

## Example Header

```sql
-- Migration: 20260523102200_add_workspace_features
-- Purpose: Add workspace-level feature flags and quotas
-- Tables: workspaces, workspace_features
-- Rollback: Remove columns and table (see DOWN section below)
--
-- DOWN:
-- ALTER TABLE workspaces DROP COLUMN IF EXISTS feature_flags;
-- DROP TABLE IF EXISTS workspace_features;
```

## Running Migrations

- Local: `supabase db reset` (dev)
- Apply: `supabase db push`
- Status: `npx tsx scripts/migration-status.ts`

## Dependencies

Migrations are applied in filename sort order. Name them carefully to control execution order.

Never delete or rename applied migration files in production environments.
