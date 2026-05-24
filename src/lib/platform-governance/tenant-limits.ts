/**
 * Tenant Limits
 * Enforces platform-level limits per tenant.
 */

export interface TenantLimits {
  maxUsers: number;
  maxStorageGB: number;
  maxApiCallsPerMonth: number;
}

const limits = new Map<string, TenantLimits>();

export function setTenantLimits(tenantId: string, limitsConfig: TenantLimits) {
  limits.set(tenantId, limitsConfig);
}

export function getTenantLimits(tenantId: string): TenantLimits | undefined {
  return limits.get(tenantId);
}
