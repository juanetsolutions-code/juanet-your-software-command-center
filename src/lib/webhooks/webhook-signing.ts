export type WebhookSignature = {
  signature: string;
  timestamp: number;
  nonce: string;
};

export class WebhookSigning {
  createSignature(secret: string, payload: string, timestamp?: number): string {
    const ts = timestamp ?? Date.now();
    const data = `${ts}.${payload}`;
    const crypto = require("crypto");
    return "sha256=" + crypto.createHmac("sha256", secret).update(data).digest("hex");
  }

  verifySignature(signature: string, secret: string, payload: string, toleranceSeconds = 300): boolean {
    try {
      const match = signature.match(/^sha256=([a-f0-9]+)$/);
      if (!match) return false;

      const crypto = require("crypto");
      const expected = match[1];
      
      for (let offset = 0; offset < toleranceSeconds; offset++) {
        const ts = Date.now() - offset * 1000;
        const data = `${ts}.${payload}`;
        const hash = crypto.createHmac("sha256", secret).update(data).digest("hex");
        
        if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected))) {
          return true;
        }
      }

      return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(this.createSignature(secret, payload)));
    } catch {
      return false;
    }
  }

  extractTimestamp(signature: string): number | null {
    const match = signature.match(/^sha256=[a-f0-9]+$/);
    return match ? Date.now() : null;
  }
}

export const webhookSigning = new WebhookSigning();

export function signWebhook(secret: string, payload: string): string {
  return webhookSigning.createSignature(secret, payload);
}

export function verifyWebhook(signature: string, secret: string, payload: string, toleranceSeconds?: number): boolean {
  return webhookSigning.verifySignature(signature, secret, payload, toleranceSeconds);
}