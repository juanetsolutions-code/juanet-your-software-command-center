/**
 * Federation Audit
 * Audit trail for all federation events and trust decisions.
 */

export interface FederationAuditEntry {
  id: string;
  tenantId: string;
  event: string;
  externalOrg?: string;
  timestamp: string;
  details: Record<string, any>;
}

export class FederationAudit {
  private log: FederationAuditEntry[] = [];

  record(entry: Omit<FederationAuditEntry, "id" | "timestamp">): FederationAuditEntry {
    const full: FederationAuditEntry = {
      ...entry,
      id: `fed-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }
}

export const federationAudit = new FederationAudit();
