/**
 * Tenant Activity Audit
 * Comprehensive activity logging for tenant lifecycle and usage.
 */

export interface TenantActivityEntry {
  id: string;
  tenantId: string;
  activity: string;
  actor: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export class TenantActivityAudit {
  private log: TenantActivityEntry[] = [];

  record(entry: Omit<TenantActivityEntry, "id" | "timestamp">): TenantActivityEntry {
    const full = { ...entry, id: `tenant-act-${Date.now()}`, timestamp: new Date().toISOString() };
    this.log.push(full);
    return full;
  }
}

export const tenantActivityAudit = new TenantActivityAudit();
