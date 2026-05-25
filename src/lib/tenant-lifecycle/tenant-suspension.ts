/**
 * Tenant Suspension
 * Handles temporary or permanent suspension with audit trail.
 */

export interface SuspensionRecord {
  tenantId: string;
  reason: string;
  suspendedAt: string;
  scheduledReactivation?: string;
}

export class TenantSuspension {
  suspend(tenantId: string, reason: string, reactivationDate?: string): SuspensionRecord {
    return {
      tenantId,
      reason,
      suspendedAt: new Date().toISOString(),
      scheduledReactivation: reactivationDate,
    };
  }
}

export const tenantSuspension = new TenantSuspension();
