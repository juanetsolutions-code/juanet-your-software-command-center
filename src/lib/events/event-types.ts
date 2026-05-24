/**
 * Event Types for the internal Event Bus.
 * Defines all domain events that can trigger automations and workflows.
 */

export interface BaseEvent {
  type: string;
  tenantId: string;
  userId?: string;
  timestamp: string;
  payload: Record<string, any>;
}

export const DOMAIN_EVENTS = {
  INVOICE_CREATED: 'invoice.created',
  PAYMENT_SUCCESS: 'payment.success',
  MESSAGE_RECEIVED: 'message.received',
  REQUEST_SUBMITTED: 'request.submitted',
  PROJECT_UPDATED: 'project.updated',
  AUTOMATION_TRIGGERED: 'automation.triggered',
  WORKFLOW_COMPLETED: 'workflow.completed',
} as const;

export type DomainEventType = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];
