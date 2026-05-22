/**
 * User-aware query context for repositories.
 * Centralizes fetching current user/tenant for filtering queries safely.
 * Prepares for multi-tenant without enforcing yet.
 */

import { readSession } from "@/lib/auth/store";
import { getCurrentOrganization } from "@/lib/tenant/context";
import type { AuthUser } from "@/lib/auth/types";

export function getCurrentUserId(): string | null {
  const session = readSession();
  return session?.user?.id ?? null;
}

export function getCurrentUser(): AuthUser | null {
  const session = readSession();
  return session?.user ?? null;
}

export function getCurrentRole(): string | null {
  return getCurrentUser()?.role ?? null;
}

export function getCurrentTenantId(): string | null {
  const org = getCurrentOrganization();
  return org?.id ?? null;
}

/**
 * Helper to apply user/tenant filter to a Supabase query builder when appropriate.
 * Repos can opt-in: q = applyUserScope(q, 'user_id')
 */
export function applyUserScope<Q extends { eq?: (col: string, val: unknown) => Q }>(
  query: Q,
  column = "user_id",
): Q {
  const uid = getCurrentUserId();
  const orgId = getCurrentTenantId();
  const qAny = query as { eq?: (col: string, val: unknown) => unknown };
  if (orgId && qAny.eq) {
    try {
      return qAny.eq("organization_id", orgId) as Q;
    } catch {
      // ignore
    }
  }
  if (uid && qAny.eq) {
    try {
      return qAny.eq(column, uid) as Q;
    } catch {
      // ignore
    }
  }
  return query;
}
