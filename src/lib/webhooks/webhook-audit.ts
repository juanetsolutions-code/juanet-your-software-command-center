/**
 * Enterprise Webhook Infrastructure - Webhook Audit
 * Provides comprehensive auditing and logging for all webhook-related activities.
 */

export interface WebhookAuditEntry {
  id: string;
  tenantId: string;
  endpointId: string;
  eventType: string;
  deliveryAttempt: number;
  status: "success" | "failed" | "retrying";
  responseCode?: number;
  errorMessage?: string;
  timestamp: string;
  durationMs: number;
}

export class WebhookAudit {
  private auditLog: WebhookAuditEntry[] = [];

  log(entry: Omit<WebhookAuditEntry, "id" | "timestamp">): WebhookAuditEntry {
    const fullEntry: WebhookAuditEntry = {
      ...entry,
      id: `wh_audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLog.push(fullEntry);
    return fullEntry;
  }

  getAuditForTenant(tenantId: string, limit = 100): WebhookAuditEntry[] {
    return this.auditLog.filter((entry) => entry.tenantId === tenantId).slice(-limit);
  }

  getAuditForEndpoint(endpointId: string, limit = 100): WebhookAuditEntry[] {
    return this.auditLog.filter((entry) => entry.endpointId === endpointId).slice(-limit);
  }
}

export const webhookAudit = new WebhookAudit();
