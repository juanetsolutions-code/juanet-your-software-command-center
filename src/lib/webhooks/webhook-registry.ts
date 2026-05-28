import type { WebhookEndpoint } from "./webhook-queue";

export type WebhookConfig = {
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    exponential: boolean;
  };
  signatureRequired: boolean;
  timeoutSeconds: number;
};

class WebhookRegistry {
  private endpoints: Map<string, WebhookEndpoint> = new Map();
  private configs: Map<string, WebhookConfig> = new Map();

  register(endpoint: WebhookEndpoint, config?: WebhookConfig): void {
    this.endpoints.set(endpoint.id, endpoint);
    if (config) {
      this.configs.set(endpoint.id, config);
    }
  }

  get(endpointId: string): WebhookEndpoint | undefined {
    return this.endpoints.get(endpointId);
  }

  getAll(): WebhookEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  getByTenant(tenantId: string): WebhookEndpoint[] {
    return Array.from(this.endpoints.values()).filter((e) => e.tenantId === tenantId);
  }

  getByEvent(eventType: string): WebhookEndpoint[] {
    return Array.from(this.endpoints.values()).filter((e) => e.events.includes(eventType));
  }

  getConfig(endpointId: string): WebhookConfig | undefined {
    return this.configs.get(endpointId);
  }

  setDefaultRetryPolicy(policy: { maxRetries: number; backoffMs: number; exponential: boolean }): void {
    for (const id of this.endpoints.keys()) {
      const existing = this.configs.get(id);
      if (!existing) {
        this.configs.set(id, {
          retryPolicy: policy,
          signatureRequired: true,
          timeoutSeconds: 30,
        });
      }
    }
  }

  remove(endpointId: string): boolean {
    this.endpoints.delete(endpointId);
    this.configs.delete(endpointId);
    return true;
  }
}

export const webhookRegistry = new WebhookRegistry();

export function registerWebhook(endpoint: WebhookEndpoint, config?: WebhookConfig): void {
  webhookRegistry.register(endpoint, config);
}

export function getWebhook(endpointId: string): WebhookEndpoint | undefined {
  return webhookRegistry.get(endpointId);
}

export function getWebhooksByTenant(tenantId: string): WebhookEndpoint[] {
  return webhookRegistry.getByTenant(tenantId);
}