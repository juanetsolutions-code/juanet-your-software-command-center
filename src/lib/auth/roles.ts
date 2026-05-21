import type { AuthRole } from "./types";

export type AuthPermission =
  | "dashboard:read"
  | "admin:read"
  | "projects:read"
  | "requests:read"
  | "messages:read"
  | "billing:read"
  | "users:manage";

const ROLE_LEVEL: Record<AuthRole, number> = {
  client: 0,
  admin: 1,
  superadmin: 2,
};

const ROLE_PERMISSIONS: Record<AuthRole, readonly AuthPermission[]> = {
  client: ["dashboard:read", "projects:read", "requests:read", "messages:read", "billing:read"],
  admin: [
    "dashboard:read",
    "admin:read",
    "projects:read",
    "requests:read",
    "messages:read",
    "billing:read",
    "users:manage",
  ],
  superadmin: [
    "dashboard:read",
    "admin:read",
    "projects:read",
    "requests:read",
    "messages:read",
    "billing:read",
    "users:manage",
  ],
};

export function normalizeAuthRole(input: unknown): AuthRole {
  if (input === "superadmin" || input === "admin" || input === "client") {
    return input;
  }
  return "client";
}

export function hasRoleAccess(currentRole: AuthRole, requiredRole: AuthRole): boolean {
  return ROLE_LEVEL[currentRole] >= ROLE_LEVEL[requiredRole];
}

export function hasAnyRoleAccess(currentRole: AuthRole, allowedRoles: readonly AuthRole[]): boolean {
  return allowedRoles.some((role) => hasRoleAccess(currentRole, role));
}

export function hasPermission(role: AuthRole, permission: AuthPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAccessDashboard(role: AuthRole): boolean {
  return hasPermission(role, "dashboard:read");
}

export function canAccessAdmin(role: AuthRole): boolean {
  return hasPermission(role, "admin:read");
}

export function getDefaultPortalPath(role: AuthRole): "/dashboard" | "/admin" {
  return canAccessAdmin(role) ? "/admin" : "/dashboard";
}