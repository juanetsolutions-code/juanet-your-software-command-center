import type { DomainEvent } from "./event-bus";

export type DomainEventType = 
  | "tenant.lifecycle"
  | "user.authentication"
  | "billing.usage"
  | "ai.model"
  | "project.status"
  | "system.health";

export type DomainEventDefinition = {
  type: DomainEventType;
  version: string;
  schema: Record<string, unknown>;
};

export const DOMAIN_EVENTS: Record<string, DomainEventDefinition> = {
  "tenant.created": {
    type: "tenant.lifecycle",
    version: "1.0",
    schema: { tenantId: "string", name: "string" },
  },
  "tenant.deleted": {
    type: "tenant.lifecycle",
    version: "1.0",
    schema: { tenantId: "string" },
  },
  "tenant.suspended": {
    type: "tenant.lifecycle",
    version: "1.0",
    schema: { tenantId: "string", reason: "string" },
  },
  "user.authenticated": {
    type: "user.authentication",
    version: "1.0",
    schema: { userId: "string", tenantId: "string" },
  },
  "user.failed-auth": {
    type: "user.authentication",
    version: "1.0",
    schema: { userId: "string?", reason: "string" },
  },
  "billing.payment-success": {
    type: "billing.usage",
    version: "1.0",
    schema: { tenantId: "string", invoiceId: "string", amount: "number" },
  },
  "billing.quota-exceeded": {
    type: "billing.usage",
    version: "1.0",
    schema: { tenantId: "string", resource: "string", limit: "number" },
  },
  "ai.model-invoked": {
    type: "ai.model",
    version: "1.0",
    schema: { modelId: "string", tenantId: "string?", tokens: "number" },
  },
  "project.created": {
    type: "project.status",
    version: "1.0",
    schema: { projectId: "string", tenantId: "string" },
  },
  "system.health-check": {
    type: "system.health",
    version: "1.0",
    schema: { status: "healthy|degraded|unhealthy" },
  },
};

export function validateDomainEvent(event: DomainEvent): boolean {
  const definition = DOMAIN_EVENTS[event.type];
  if (!definition) return false;

  return event.version === definition.version;
}

export function getDomainEventDefinition(type: string): DomainEventDefinition | undefined {
  return DOMAIN_EVENTS[type];
}