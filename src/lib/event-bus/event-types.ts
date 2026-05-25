/**
 * Event Bus Infrastructure - Core Event Types
 * Defines the standard event structure used across the entire integration and connectivity ecosystem.
 * All events are tenant-scoped by design.
 */

export interface IntegrationEvent<T = any> {
  id: string;
  tenantId: string;
  type: string;
  payload: T;
  timestamp: string;
  source: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export type EventType =
  | "integration.started"
  | "integration.completed"
  | "integration.failed"
  | "sync.started"
  | "sync.progress"
  | "sync.completed"
  | "webhook.received"
  | "webhook.delivered"
  | "federation.user.linked"
  | "pipeline.step.completed";

export interface EventHandler<T = any> {
  (event: IntegrationEvent<T>): Promise<void> | void;
}
