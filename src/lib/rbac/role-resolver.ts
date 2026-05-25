/**
 * Role Resolver
 * Resolves user roles within a tenant, supporting hierarchy and inheritance.
 */

export interface Role {
  name: string;
  level: number; // higher = more privileged
  tenantId: string;
  permissions: string[];
}

export class RoleResolver {
  resolveRoles(tenantId: string, userId: string, rawRoles: string[]): Role[] {
    const roleMap: Record<string, Role> = {
      owner: { name: "owner", level: 100, tenantId, permissions: ["*"] },
      admin: { name: "admin", level: 70, tenantId, permissions: ["read", "write", "delete"] },
      member: { name: "member", level: 40, tenantId, permissions: ["read", "write"] },
      viewer: { name: "viewer", level: 10, tenantId, permissions: ["read"] },
    };

    return rawRoles
      .map((r) => roleMap[r.toLowerCase()])
      .filter(Boolean)
      .map((r) => ({ ...r, tenantId }));
  }
}

export const roleResolver = new RoleResolver();
