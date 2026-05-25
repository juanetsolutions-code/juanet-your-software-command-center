/**
 * Webhook Events - Standard events for the platform.
 */

export const WEBHOOK_EVENTS = {
  PROJECT_UPDATED: "project.updated",
  REQUEST_CREATED: "request.created",
  MESSAGE_SENT: "message.sent",
  INVOICE_PAID: "invoice.paid",
  AI_AUTOMATION_TRIGGERED: "ai.automation.triggered",
} as const;

export interface WebhookEvent {
  id: string;
  type: string;
  tenantId: string;
  payload: any;
  signature?: string;
  receivedAt: string;
}

export const createWebhookEvent = (type: string, tenantId: string, payload: any): WebhookEvent => ({
  id: `wh_${Date.now()}`,
  type,
  tenantId,
  payload,
  receivedAt: new Date().toISOString(),
});
