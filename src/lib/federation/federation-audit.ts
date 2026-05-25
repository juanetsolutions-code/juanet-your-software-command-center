/**
 * External Identity Federation Infrastructure - Federation Audit
 * Provides auditing capabilities for all federation-related events and changes.
 */

export interface FederationAuditEntry {
  id: string;
  tenantId: string;
  federationId: string;
  action: string;
  details: Record<string, any>;
  performedBy: string;
  timestamp: string;
}

export class FederationAudit {
  private auditLog: FederationAuditEntry[] = [];

  log(entry: Omit<FederationAuditEntry, "id" | "timestamp">): FederationAuditEntry {
    const fullEntry: FederationAuditEntry = {
      ...entry,
      id: `fed_audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLog.push(fullEntry);
    return fullEntry;
  }

  getAuditForTenant(tenantId: string, limit = 100): FederationAuditEntry[] {
    return this.auditLog.filter((entry) => entry.tenantId === tenantId).slice(-limit);
  }
}

export const federationAudit = new FederationAudit();
