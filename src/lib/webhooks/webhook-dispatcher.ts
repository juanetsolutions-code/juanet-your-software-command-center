/**
 * Enterprise Webhook Infrastructure - Webhook Dispatcher
 * Core dispatcher responsible for delivering webhooks to external endpoints.
 */

import type { WebhookEvent } from "./webhook-events";

export interface WebhookEndpoint {
  id: string;
  tenantId: string;
  url: string;
  secret?: string;
  events: string[];
  active: boolean;
}

export class WebhookDispatcher {
  private endpoints: WebhookEndpoint[] = [];

  registerEndpoint(endpoint: WebhookEndpoint): void {
    this.endpoints.push(endpoint);
  }

  async dispatch(event: WebhookEvent): Promise<void> {
    const relevantEndpoints = this.endpoints.filter(
      (ep) => ep.active && ep.tenantId === event.tenantId && ep.events.includes(event.type),
    );

    for (const endpoint of relevantEndpoints) {
      try {
        // In real implementation: sign payload, send HTTP POST with retries
        console.log(
          `[Webhooks] Dispatching ${event.type} to ${endpoint.url} for tenant ${event.tenantId}`,
        );
      } catch (error) {
        console.error(`[Webhooks] Failed to dispatch to ${endpoint.url}:`, error);
      }
    }
  }
}

export const webhookDispatcher = new WebhookDispatcher();
