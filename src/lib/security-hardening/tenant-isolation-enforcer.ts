/**
 * Tenant Isolation Enforcer
 * Runtime enforcement of strict tenant data boundaries and context isolation.
 */

export interface IsolationCheck {
  passed: boolean;
  reason?: string;
  tenantId: string;
}

export class TenantIsolationEnforcer {
  enforce(tenantId: string, resourceTenantId: string, userContext: any): IsolationCheck {
    if (tenantId !== resourceTenantId && !userContext?.isPlatformAdmin) {
      return {
        passed: false,
        reason: "Cross-tenant access denied",
        tenantId,
      };
    }
    return { passed: true, tenantId };
  }

  validateContext(context: any): boolean {
    return !!context?.tenantId && context.tenantId.length > 0;
  }
}

export const tenantIsolationEnforcer = new TenantIsolationEnforcer();
