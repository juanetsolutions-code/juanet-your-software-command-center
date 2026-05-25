/**
 * Command Audit
 * Complete immutable audit of all enterprise command activity.
 */

export interface CommandAuditEntry {
  id: string;
  commandId: string;
  tenantId?: string;
  command: string;
  actor: string;
  result: string;
  timestamp: string;
}

export class CommandAudit {
  private log: CommandAuditEntry[] = [];

  record(entry: Omit<CommandAuditEntry, "id" | "timestamp">): CommandAuditEntry {
    const full: CommandAuditEntry = {
      ...entry,
      id: `cmd-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }
}

export const commandAudit = new CommandAudit();
