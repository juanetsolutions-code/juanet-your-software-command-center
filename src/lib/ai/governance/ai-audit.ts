/**
 * AI Audit & Governance Layer
 * Tracks AI usage, requests, and actions for compliance and billing.
 */

import { logger } from "@/lib/utils/logger";

export interface AIAuditEvent {
  tenantId: string;
  userId?: string;
  action: string;
  model?: string;
  tokens?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

const auditLog: AIAuditEvent[] = [];

export function logAIAudit(event: Omit<AIAuditEvent, "timestamp">) {
  const fullEvent: AIAuditEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  auditLog.push(fullEvent);
  logger.info("[AI Audit]", fullEvent);
}

export function getAIAuditLog(tenantId?: string): AIAuditEvent[] {
  if (tenantId) {
    return auditLog.filter((e) => e.tenantId === tenantId);
  }
  return [...auditLog];
}

export function clearAIAuditLog() {
  auditLog.length = 0;
}
