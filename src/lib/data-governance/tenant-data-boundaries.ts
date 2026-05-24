export interface BoundaryCheckResult {
  allowed: boolean;
  reason?: string;
}

export function checkTenantBoundary(callerTenantId: string, resourceTenantId: string): BoundaryCheckResult {
  if (callerTenantId !== resourceTenantId) {
    return { allowed: false, reason: "cross_tenant_access_denied" };
  }
  return { allowed: true };
}

export function assertTenantBoundary(callerTenantId: string, resourceTenantId: string): void {
  const r = checkTenantBoundary(callerTenantId, resourceTenantId);
  if (!r.allowed) throw new Error(r.reason);
}
