/**
 * Extension Audit
 * Immutable audit trail for all extension lifecycle and execution events.
 */

export interface ExtensionAuditEntry {
  id: string;
  tenantId: string;
  extensionId: string;
  action: string;
  actor: string;
  timestamp: string;
  details: Record<string, any>;
}

export class ExtensionAudit {
  private log: ExtensionAuditEntry[] = [];

  record(entry: Omit<ExtensionAuditEntry, "id" | "timestamp">): ExtensionAuditEntry {
    const full: ExtensionAuditEntry = {
      ...entry,
      id: `ext-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }
}

export const extensionAudit = new ExtensionAudit();
