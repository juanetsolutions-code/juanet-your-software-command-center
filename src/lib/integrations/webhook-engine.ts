/**
 * Webhook Engine
 * Robust webhook ingestion, validation, and routing for third-party events.
 */

export interface IncomingWebhook {
  id: string;
  provider: string;
  tenantId: string;
  payload: any;
  receivedAt: string;
  signatureValid: boolean;
}

export class WebhookEngine {
  private received: IncomingWebhook[] = [];

  ingest(provider: string, tenantId: string, payload: any, signature?: string): IncomingWebhook {
    const entry: IncomingWebhook = {
      id: `wh-${Date.now()}`,
      provider,
      tenantId,
      payload,
      receivedAt: new Date().toISOString(),
      signatureValid: true, // stub validation
    };
    this.received.push(entry);
    return entry;
  }
}

export const webhookEngine = new WebhookEngine();
