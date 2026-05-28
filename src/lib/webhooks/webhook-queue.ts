import type { DomainEvent } from "../event-bus/event-bus";

export type DeliveryStatus = "pending" | "delivered" | "failed" | "retrying";

export type WebhookEndpoint = {
  id: string;
  tenantId: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastDelivery?: string;
  failureCount: number;
};

export type WebhookDelivery = {
  id: string;
  endpointId: string;
  event: DomainEvent;
  status: DeliveryStatus;
  attempt: number;
  response?: {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  };
  error?: string;
  createdAt: string;
  completedAt?: string;
};

export type WebhookRetryPolicy = {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
};

class WebhookDeliveryQueue {
  private endpoints: Map<string, WebhookEndpoint> = new Map();
  private deliveries: Map<string, WebhookDelivery> = new Map();
  private queues: Map<string, WebhookDelivery[]> = new Map();
  private defaultRetryPolicy: WebhookRetryPolicy = {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
  };

  registerEndpoint(endpoint: WebhookEndpoint): void {
    this.endpoints.set(endpoint.id, endpoint);
  }

  unregisterEndpoint(endpointId: string): void {
    this.endpoints.delete(endpointId);
  }

  getEndpoint(endpointId: string): WebhookEndpoint | undefined {
    return this.endpoints.get(endpointId);
  }

  getActiveEndpoints(eventType: string, tenantId?: string): WebhookEndpoint[] {
    return Array.from(this.endpoints.values()).filter((e) => {
      if (!e.isActive) return false;
      if (!e.events.includes(eventType)) return false;
      if (tenantId && e.tenantId !== tenantId) return false;
      return true;
    });
  }

  enqueue(endpointId: string, event: DomainEvent): WebhookDelivery {
    const delivery: WebhookDelivery = {
      id: generateDeliveryId(),
      endpointId,
      event,
      status: "pending",
      attempt: 0,
      createdAt: new Date().toISOString(),
    };

    const queue = this.queues.get(endpointId) ?? [];
    queue.push(delivery);
    this.queues.set(endpointId, queue);
    this.deliveries.set(delivery.id, delivery);

    return delivery;
  }

  getQueuedDeliveries(endpointId: string): WebhookDelivery[] {
    return this.queues.get(endpointId) ?? [];
  }

  clearQueue(endpointId: string): void {
    this.queues.delete(endpointId);
  }

  updateDelivery(deliveryId: string, updates: Partial<WebhookDelivery>): void {
    const existing = this.deliveries.get(deliveryId);
    if (existing) {
      this.deliveries.set(deliveryId, { ...existing, ...updates });
    }
  }

  getDelivery(deliveryId: string): WebhookDelivery | undefined {
    return this.deliveries.get(deliveryId);
  }

  getAllDeliveries(): WebhookDelivery[] {
    return Array.from(this.deliveries.values());
  }

  getDefaultRetryPolicy(): WebhookRetryPolicy {
    return { ...this.defaultRetryPolicy };
  }

  setDefaultRetryPolicy(policy: Partial<WebhookRetryPolicy>): void {
    this.defaultRetryPolicy = { ...this.defaultRetryPolicy, ...policy };
  }
}

export const webhookQueue = new WebhookDeliveryQueue();

export function registerWebhookEndpoint(endpoint: WebhookEndpoint): void {
  webhookQueue.registerEndpoint(endpoint);
}

export function enqueueWebhook(endpointId: string, event: DomainEvent): WebhookDelivery {
  return webhookQueue.enqueue(endpointId, event);
}

export function getWebhookDelivery(deliveryId: string): WebhookDelivery | undefined {
  return webhookQueue.getDelivery(deliveryId);
}

function generateDeliveryId(): string {
  return `wh_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}