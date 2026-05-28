import type { WebhookEndpoint, WebhookDelivery, WebhookRetryPolicy } from "./webhook-queue";
import type { DomainEvent } from "../event-bus/event-bus";

export function calculateRetryDelay(attempt: number, policy: WebhookRetryPolicy): number {
  const exponentialDelay = policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt - 1);
  return Math.min(exponentialDelay, policy.maxDelayMs);
}

export function shouldRetry(attempt: number, policy: WebhookRetryPolicy, statusOverride?: number): boolean {
  return attempt < policy.maxAttempts && (!statusOverride || statusOverride >= 500 || statusOverride === 429);
}

export async function executeDelivery(
  endpoint: WebhookEndpoint,
  delivery: WebhookDelivery,
  policy: WebhookRetryPolicy
): Promise<Result> {
  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": generateSignature(endpoint.secret, JSON.stringify(delivery.event)),
        "X-Webhook-Event": delivery.event.type,
        "X-Webhook-Delivery": delivery.id,
      },
      body: JSON.stringify({
        id: delivery.event.id,
        type: delivery.event.type,
        tenantId: delivery.event.tenantId,
        timestamp: delivery.event.timestamp,
        payload: delivery.event.payload,
      }),
    });

    if (response.ok) {
      return { success: true, status: response.status };
    }

    if (shouldRetry(delivery.attempt, policy, response.status)) {
      const delay = calculateRetryDelay(delivery.attempt, policy);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return { success: false, status: response.status, retry: true };
    }

    return { success: false, status: response.status, retry: false };
  } catch {
    if (shouldRetry(delivery.attempt, policy)) {
      const delay = calculateRetryDelay(delivery.attempt, policy);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return { success: false, error: "Network error", retry: true };
    }
    return { success: false, error: "Network error", retry: false };
  }
}

export function generateSignature(secret: string, payload: string): string {
  const crypto = require("crypto");
  return "sha256=" + crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignature(secret: string, signature: string, payload: string): boolean {
  const expected = generateSignature(secret, payload);
  return expected === signature;
}

export type Result = 
  | { success: true; status: number }
  | { success: false; status?: number; error?: string; retry: boolean };

export function getRetryPolicy(attempt: number, customPolicies?: Record<string, WebhookRetryPolicy>): WebhookRetryPolicy | null {
  return customPolicies?.[`attempt-${attempt}`] ?? null;
}