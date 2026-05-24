/**
 * Webhook Router - Routes incoming webhooks to handlers.
 */

export interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  signature?: string;
}

const handlers = new Map<string, (payload: WebhookPayload) => void>();

export function registerWebhookHandler(event: string, handler: (payload: WebhookPayload) => void) {
  handlers.set(event, handler);
}

export function routeWebhook(payload: WebhookPayload) {
  const handler = handlers.get(payload.event);
  if (handler) {
    handler(payload);
  }
}
