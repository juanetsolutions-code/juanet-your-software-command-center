/**
 * Security Audit
 * Specialized immutable audit for security-related events.
 */

export interface SecurityAuditEntry {
  id: string;
  tenantId: string;
  event: string;
  actor: string;
  severity: "info" | "warning" | "critical";
  details: Record<string, any>;
  timestamp: string;
}

export class SecurityAudit {
  private log: SecurityAuditEntry[] = [];

  record(entry: Omit<SecurityAuditEntry, "id" | "timestamp">): SecurityAuditEntry {
    const full = { ...entry, id: `sec-${Date.now()}`, timestamp: new Date().toISOString() };
    this.log.push(full);
    return full;
  }
}

export const securityAudit = new SecurityAudit();
