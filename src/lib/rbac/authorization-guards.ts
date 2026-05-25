/**
 * Authorization Guards
 * Reusable guard functions for protecting operations (non-UI layer).
 */

import { permissionEngine } from "./permission-engine";
import { roleResolver } from "./role-resolver";

export interface GuardResult {
  allowed: boolean;
  reason: string;
}

export function requirePermission(
  tenantId: string,
  userId: string,
  rawRoles: string[],
  resource: string,
  action: string,
): GuardResult {
  const roles = roleResolver.resolveRoles(tenantId, userId, rawRoles);
  const evaluation = permissionEngine.evaluate(tenantId, roles, { resource, action });

  return {
    allowed: evaluation.allowed,
    reason: evaluation.reason,
  };
}

export function requireTenantAccess(
  requestingTenant: string,
  targetTenant: string,
  roles: string[],
): GuardResult {
  const hasAccess = requestingTenant === targetTenant || roles.includes("platform_admin");
  return {
    allowed: hasAccess,
    reason: hasAccess ? "access_granted" : "tenant_isolation_violation",
  };
}
