/**
 * Tenant Access
 * Enforces tenant-scoped access boundaries and cross-tenant isolation.
 */

export interface TenantAccessResult {
  tenantId: string;
  userId: string;
  hasAccess: boolean;
  reason: string;
  scope: "full" | "limited" | "none";
}

export class TenantAccess {
  validateAccess(
    requestingTenantId: string,
    targetTenantId: string,
    userRoles: string[],
  ): TenantAccessResult {
    const isSameTenant = requestingTenantId === targetTenantId;
    const isPlatformAdmin = userRoles.includes("platform_admin");

    if (isSameTenant) {
      return {
        tenantId: targetTenantId,
        userId: "",
        hasAccess: true,
        reason: "same_tenant",
        scope: "full",
      };
    }
    if (isPlatformAdmin) {
      return {
        tenantId: targetTenantId,
        userId: "",
        hasAccess: true,
        reason: "platform_admin",
        scope: "limited",
      };
    }

    return {
      tenantId: targetTenantId,
      userId: "",
      hasAccess: false,
      reason: "cross_tenant_denied",
      scope: "none",
    };
  }
}

export const tenantAccess = new TenantAccess();
