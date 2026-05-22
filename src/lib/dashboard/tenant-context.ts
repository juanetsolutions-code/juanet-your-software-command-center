/**
 * Dashboard Tenant Context — resolves active org/workspace/membership.
 * Builds on lib/tenant and auth.
 * SSR-safe, never throws, provides fallbacks.
 * Used by repositories for scoping (read-only for now).
 */

import { readSession } from "@/lib/auth/store";
import {
  getCurrentOrganization as baseGetOrg,
  clearOrganizationCache as baseClear,
} from "@/lib/tenant/context";
import { getCurrentUserId } from "./query-context";
import type { Organization } from "@/lib/tenant/types";

let cachedWorkspace: { id: string; name: string } | null = null;

export interface TenantContext {
  userId: string | null;
  organization: Organization | null;
  workspaceId: string | null;
  role: string | null;
}

export function getTenantContext(): TenantContext {
  const session = readSession();
  const org = baseGetOrg();

  return {
    userId: session?.user?.id ?? null,
    organization: org,
    workspaceId: cachedWorkspace?.id ?? null,
    role: session?.user?.role ?? null,
  };
}

export function setCurrentWorkspace(workspace: { id: string; name: string } | null) {
  cachedWorkspace = workspace;
}

export function getCurrentWorkspaceId(): string | null {
  return cachedWorkspace?.id ?? null;
}

export function clearTenantCaches() {
  baseClear();
  cachedWorkspace = null;
}

// Helper for repos: returns org_id to filter by, or null
export function getActiveOrganizationId(): string | null {
  return getTenantContext().organization?.id ?? null;
}
