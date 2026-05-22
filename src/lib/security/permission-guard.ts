/**
 * Permission Guard
 * Central RBAC enforcement point for repositories and services.
 */

import { hasPermission } from "@/lib/auth/permissions";
import type { AuthPermission } from "@/lib/auth/roles";
import { readSession } from "@/lib/auth/store";
import { getCurrentOrganization } from "@/lib/tenant/context";
import { errorTracker } from "@/lib/monitoring/error-tracker";

export function requirePermission(permission: AuthPermission | string): boolean {
  const session = readSession();
  if (!session) {
    errorTracker.auth(new Error("No active session"), "permission_check");
    return false;
  }

  const role = session.user.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allowed = hasPermission(role, permission as any);

  if (!allowed) {
    errorTracker.auth(new Error(`Missing permission: ${permission}`), "permission_denied", {
      role,
      permission,
    });
  }

  return allowed;
}

export function requireTenantAccess(resourceTenantId?: string | null): boolean {
  const org = getCurrentOrganization();
  if (!org) return false;

  if (!resourceTenantId) return true; // public or personal resource

  const allowed = org.id === resourceTenantId;

  if (!allowed) {
    errorTracker.auth(new Error("Cross-tenant access attempt"), "tenant_violation", {
      current: org.id,
      requested: resourceTenantId,
    });
  }

  return allowed;
}

export const permissionGuard = {
  requirePermission,
  requireTenantAccess,
};

export default permissionGuard;
