/**
 * Permission layer for multi-tenant RBAC.
 * Builds on existing roles system.
 * Future: integrate with organization_members / workspace_members roles.
 */

import { hasPermission as baseHasPermission, type AuthPermission } from "./roles";
import type { AuthRole } from "./types";

export type TenantRole = "owner" | "admin" | "manager" | "member" | "client";

// Extended roles for tenant context
const TENANT_ROLE_LEVEL: Record<TenantRole, number> = {
  owner: 4,
  admin: 3,
  manager: 2,
  member: 1,
  client: 0,
};

const TENANT_PERMISSIONS: Record<TenantRole, readonly string[]> = {
  owner: ["*"], // full access
  admin: ["org:manage", "workspace:manage", "users:invite", "projects:write", "billing:manage"],
  manager: ["projects:write", "requests:write", "messages:send", "invoices:view"],
  member: ["projects:read", "requests:read", "messages:read"],
  client: ["dashboard:read", "projects:read", "requests:read", "messages:read", "billing:read"],
};

export function hasTenantRoleAccess(current: TenantRole, required: TenantRole): boolean {
  return TENANT_ROLE_LEVEL[current] >= TENANT_ROLE_LEVEL[required];
}

export function hasPermission(
  role: AuthRole | TenantRole,
  permission: AuthPermission | string,
): boolean {
  // Check global roles first
  if (["superadmin", "admin", "client"].includes(role as string)) {
    return baseHasPermission(role as AuthRole, permission as AuthPermission);
  }
  const perms = TENANT_PERMISSIONS[role as TenantRole] || [];
  return perms.includes("*") || perms.includes(permission);
}

export function canAccessOrganization(
  role: AuthRole | TenantRole,
  orgId: string,
  userOrgId?: string,
): boolean {
  if (["superadmin", "owner", "admin"].includes(role as string)) return true;
  return userOrgId === orgId;
}

export function canAccessWorkspace(
  role: AuthRole | TenantRole,
  workspaceId: string,
  userWorkspaces?: string[],
): boolean {
  if (["superadmin", "owner", "admin", "manager"].includes(role as string)) return true;
  return !!userWorkspaces?.includes(workspaceId);
}

// Convenience for future use in repos
export function requirePermission(role: AuthRole | TenantRole, permission: string): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission} for role ${role}`);
  }
}
