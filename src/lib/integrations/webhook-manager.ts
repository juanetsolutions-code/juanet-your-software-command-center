/**
 * Webhook Manager for integrations.
 */

export interface WebhookEvent {
  type: string;
  payload: any;
  tenantId: string;
}

const webhooks = new Map<string, (event: WebhookEvent) => void>();

export function registerWebhook(type: string, handler: (event: WebhookEvent) => void) {
  webhooks.set(type, handler);
}

export function dispatchWebhook(event: WebhookEvent) {
  const handler = webhooks.get(event.type);
  if (handler) handler(event);
}
