/**
 * Lifecycle Audit
 * Full audit trail for all tenant lifecycle state changes.
 */

export interface LifecycleAuditEntry {
  id: string;
  tenantId: string;
  action: string;
  actor: string;
  details: Record<string, any>;
  timestamp: string;
}

export class LifecycleAudit {
  private log: LifecycleAuditEntry[] = [];

  record(
    tenantId: string,
    action: string,
    actor: string,
    details: Record<string, any>,
  ): LifecycleAuditEntry {
    const entry: LifecycleAuditEntry = {
      id: `life-${Date.now()}`,
      tenantId,
      action,
      actor,
      details,
      timestamp: new Date().toISOString(),
    };
    this.log.push(entry);
    return entry;
  }

  getHistory(tenantId: string): LifecycleAuditEntry[] {
    return this.log.filter((e) => e.tenantId === tenantId);
  }
}

export const lifecycleAudit = new LifecycleAudit();
