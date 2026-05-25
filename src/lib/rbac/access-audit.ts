/**
 * Access Audit
 * Immutable audit trail for all RBAC decisions (preparation for compliance).
 */

export interface AccessAuditEntry {
  id: string;
  tenantId: string;
  userId: string;
  resource: string;
  action: string;
  allowed: boolean;
  role: string;
  reason: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class AccessAudit {
  private entries: AccessAuditEntry[] = [];

  record(entry: Omit<AccessAuditEntry, "id" | "timestamp">): AccessAuditEntry {
    const full: AccessAuditEntry = {
      ...entry,
      id: `access-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.entries.push(full);
    return full;
  }

  getEntriesForTenant(tenantId: string, limit = 100): AccessAuditEntry[] {
    return this.entries.filter((e) => e.tenantId === tenantId).slice(-limit);
  }
}

export const accessAudit = new AccessAudit();
