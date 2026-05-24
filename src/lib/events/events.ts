/**
 * Workflow Event Expansion.
 * Defines new event categories for AI and automation.
 */

export const AI_EVENTS = {
  REQUEST_SENT: "ai.request.sent",
  RESPONSE_RECEIVED: "ai.response.received",
  AUTOMATION_TRIGGERED: "ai.automation.triggered",
  GOVERNANCE_VIOLATION: "ai.governance.violation",
} as const;

export const AUTOMATION_EVENTS = {
  WORKFLOW_STARTED: "automation.workflow.started",
  WORKFLOW_COMPLETED: "automation.workflow.completed",
  ACTION_EXECUTED: "automation.action.executed",
} as const;

export const WEBHOOK_EVENTS = {
  RECEIVED: "webhook.received",
  DELIVERED: "webhook.delivered",
  FAILED: "webhook.failed",
} as const;

export const INTEGRATION_EVENTS = {
  CONNECTED: "integration.connected",
  SYNCED: "integration.synced",
  ERROR: "integration.error",
} as const;

// Tenant-isolated event emitter placeholder
export function emitEvent(event: string, payload: any, tenantId: string) {
  // In real impl, would use event bus with tenant filtering
  console.log(`[Events] ${event} for tenant ${tenantId}`, payload);
}
