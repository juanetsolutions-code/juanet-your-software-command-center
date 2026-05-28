import type { DomainEvent } from "./event-bus";

export type EventTypes = {
  // Tenant lifecycle
  "tenant.created": { tenantId: string; name: string; plan: string };
  "tenant.updated": { tenantId: string; changes: Record<string, unknown> };
  "tenant.deleted": { tenantId: string };
  "tenant.suspended": { tenantId: string; reason: string };

  // User events
  "user.created": { userId: string; tenantId: string; email: string };
  "user.deleted": { userId: string; tenantId: string };
  "user.authenticated": { userId: string; tenantId: string; method: string };
  "user.failed-auth": { userId?: string; tenantId?: string; reason: string };

  // Billing events
  "billing.subscription-created": { tenantId: string; subscriptionId: string; plan: string };
  "billing.subscription-cancelled": { tenantId: string; subscriptionId: string };
  "billing.payment-success": { tenantId: string; invoiceId: string; amount: number };
  "billing.payment-failed": { tenantId: string; invoiceId: string; amount: number; error: string };
  "billing.quota-exceeded": { tenantId: string; resource: string; limit: number };

  // AI events
  "ai.model-invoked": { modelId: string; tenantId?: string; tokens: number };
  "ai.model-error": { modelId: string; tenantId?: string; error: string };
  "ai.quota-warning": { tenantId: string; usage: number; limit: number };

  // Project events
  "project.created": { projectId: string; tenantId: string };
  "project.status-changed": { projectId: string; tenantId: string; status: string };

  // System events
  "system.health-check": { status: "healthy" | "degraded" | "unhealthy"; details?: Record<string, unknown> };
  "system.alert": { level: "info" | "warning" | "error"; message: string };
};

export function createEvent<T extends keyof EventTypes>(
  type: T,
  payload: EventTypes[T] & { tenantId?: string },
  options?: { metadata?: Record<string, unknown> }
): DomainEvent {
  return {
    id: generateEventId(),
    type,
    tenantId: payload.tenantId,
    timestamp: new Date().toISOString(),
    payload: payload as unknown as Record<string, unknown>,
    metadata: options?.metadata,
    version: "1.0",
  };
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}