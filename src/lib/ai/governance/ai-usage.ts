/**
 * AI Usage Tracking for billing and quotas.
 */

const usage = new Map<string, { tokens: number; requests: number }>();

export function recordAIUsage(tenantId: string, tokens: number) {
  const current = usage.get(tenantId) || { tokens: 0, requests: 0 };
  current.tokens += tokens;
  current.requests += 1;
  usage.set(tenantId, current);
}

export function getAIUsage(tenantId: string) {
  return usage.get(tenantId) || { tokens: 0, requests: 0 };
}

export function resetAIUsage(tenantId: string) {
  usage.delete(tenantId);
}
