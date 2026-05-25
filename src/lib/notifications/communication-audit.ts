/**
 * Communication Audit
 * Full audit trail for all outbound communications.
 */

export interface CommunicationAuditEntry {
  id: string;
  tenantId: string;
  type: "email" | "sms" | "inapp";
  recipient: string;
  status: string;
  timestamp: string;
}

export class CommunicationAudit {
  private log: CommunicationAuditEntry[] = [];

  record(entry: Omit<CommunicationAuditEntry, "id" | "timestamp">): CommunicationAuditEntry {
    const full: CommunicationAuditEntry = {
      ...entry,
      id: `comm-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }
}

export const communicationAudit = new CommunicationAudit();
