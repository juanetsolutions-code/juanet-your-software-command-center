/**
 * Tenant / organization context helpers.
 *
 * These do NOT yet enforce RLS. They provide a stable surface so
 * repositories can opt into organization-scoped queries today and the
 * backend can plug in real RLS / membership lookups tomorrow.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { readSession } from "@/lib/auth/store";
import { logger } from "@/lib/utils/logger";
import type { Organization } from "./types";

let cachedOrg: Organization | null = null;

/**
 * Returns the active organization for the current session.
 * Falls back to a synthetic "personal" organization derived from the user id
 * so repositories never crash while the orgs table is being modeled.
 */
export function getCurrentOrganization(): Organization | null {
  if (cachedOrg) return cachedOrg;

  const session = readSession();
  if (!session) return null;

  const orgId = session.user.organizationId || `org_${session.user.id}`;
  // Synthetic fallback — single-tenant per user until orgs table + memberships exist.
  // When real orgs are fetched, this will be replaced by lookup.
  cachedOrg = {
    id: orgId,
    name: `${session.user.fullName}'s Workspace`,
    slug: session.user.id,
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  return cachedOrg;
}

export function requireOrganization(): Organization {
  const org = getCurrentOrganization();
  if (!org) throw new Error("No active organization for current session.");
  return org;
}

export function clearOrganizationCache(): void {
  cachedOrg = null;
}

/**
 * Apply a tenant scope filter to a Supabase query builder.
 * Repositories should call this when querying tables that carry an
 * `organization_id` column. Tables without one are returned unchanged.
 */
export function scopedQuery<Q extends { eq: (col: string, val: unknown) => Q }>(
  query: Q,
  options: { column?: string; orgId?: string | null } = {},
): Q {
  const orgId = options.orgId ?? getCurrentOrganization()?.id;
  if (!orgId) {
    logger.warn("[tenant] scopedQuery called without an active organization");
    return query;
  }
  return query.eq(options.column ?? "organization_id", orgId);
}

/**
 * Convenience: build a Supabase select pre-scoped to the current org.
 */
export function scopedSelect(
  client: SupabaseClient,
  table: string,
  columns = "*",
  options: { column?: string; orgId?: string | null } = {},
) {
  const builder = client.from(table).select(columns) as unknown as {
    eq: (col: string, val: unknown) => typeof builder;
  };
  return scopedQuery(builder, options);
}
