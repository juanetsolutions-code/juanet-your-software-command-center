/**
 * Copilot Audit
 * Complete audit trail for all copilot sessions, decisions, and executed actions.
 */

export interface CopilotAuditEntry {
  id: string;
  sessionId: string;
  tenantId: string;
  event: string;
  details: Record<string, any>;
  timestamp: string;
  actor: "copilot" | "user" | "system";
}

export class CopilotAudit {
  private log: CopilotAuditEntry[] = [];

  record(entry: Omit<CopilotAuditEntry, "id" | "timestamp">): CopilotAuditEntry {
    const full: CopilotAuditEntry = {
      ...entry,
      id: `copilot-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }

  getAuditForTenant(tenantId: string, limit = 100): CopilotAuditEntry[] {
    return this.log.filter((e) => e.tenantId === tenantId).slice(-limit);
  }
}

export const copilotAudit = new CopilotAudit();
