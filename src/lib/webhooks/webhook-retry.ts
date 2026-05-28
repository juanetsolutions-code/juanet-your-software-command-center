import type { WebhookDelivery, WebhookRetryPolicy } from "./webhook-queue";

export function calculateExponentialBackoff(
  attempt: number,
  policy: WebhookRetryPolicy
): number {
  const delay = policy.initialDelayMs * Math.pow(policy.backoffMultiplier, attempt);
  return Math.min(delay, policy.maxDelayMs);
}

export async function scheduleRetry(
  delivery: WebhookDelivery,
  policy: WebhookRetryPolicy
): Promise<number> {
  const delay = calculateExponentialBackoff(delivery.attempt, policy);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function shouldRetryDelivery(
  delivery: WebhookDelivery,
  policy: WebhookRetryPolicy,
  responseStatus?: number
): boolean {
  if (delivery.attempt >= policy.maxAttempts) {
    return false;
  }

  if (responseStatus) {
    return responseStatus >= 500 || responseStatus === 429;
  }

  return true;
}

export function getRetryStatus(delivery: WebhookDelivery, policy: WebhookRetryPolicy): string {
  const remaining = policy.maxAttempts - delivery.attempt;
  const nextDelay = calculateExponentialBackoff(delivery.attempt, policy);
  
  return `${remaining} attempts remaining, next in ${Math.round(nextDelay / 1000)}s`;
}