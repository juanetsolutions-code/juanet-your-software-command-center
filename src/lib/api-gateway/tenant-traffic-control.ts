/**
 * Tenant Traffic Control
 * Per-tenant traffic shaping, prioritization, and quota enforcement.
 */

export interface TenantTrafficControl {
  tenantId: string;
  currentRps: number;
  quota: number;
  priority: number;
}

export class TenantTrafficControlManager {
  private controls = new Map<string, TenantTrafficControl>();

  getControl(tenantId: string): TenantTrafficControl {
    if (!this.controls.has(tenantId)) {
      this.controls.set(tenantId, { tenantId, currentRps: 0, quota: 1000, priority: 1 });
    }
    return this.controls.get(tenantId)!;
  }
}

export const tenantTrafficControlManager = new TenantTrafficControlManager();
