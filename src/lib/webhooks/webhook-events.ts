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
