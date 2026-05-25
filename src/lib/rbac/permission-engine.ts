/**
 * Real RBAC Enforcement - Permission Engine
 * Core engine for evaluating tenant-scoped permissions with role hierarchy.
 * Compatible with existing auth/session systems.
 */

import type { Role } from "./role-resolver";

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface PermissionEvaluation {
  allowed: boolean;
  reason: string;
  role: Role;
  tenantId: string;
  resource: string;
  action: string;
  evaluatedAt: string;
}

export class PermissionEngine {
  evaluate(tenantId: string, userRoles: Role[], permission: Permission): PermissionEvaluation {
    // Simple hierarchy: owner > admin > member > viewer
    const highestRole = userRoles.sort((a, b) => b.level - a.level)[0] || {
      name: "none",
      level: 0,
    };

    let allowed = false;
    if (highestRole.level >= 100)
      allowed = true; // owner
    else if (highestRole.level >= 70 && ["read", "write", "delete"].includes(permission.action))
      allowed = true;
    else if (highestRole.level >= 40 && ["read", "write"].includes(permission.action))
      allowed = true;
    else if (highestRole.level >= 10 && permission.action === "read") allowed = true;

    return {
      allowed,
      reason: allowed ? "role_sufficient" : "insufficient_privileges",
      role: highestRole,
      tenantId,
      resource: permission.resource,
      action: permission.action,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

export const permissionEngine = new PermissionEngine();
