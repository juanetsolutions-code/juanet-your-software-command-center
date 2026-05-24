/**
 * Quota Tracking.
 */

const quotas = new Map<string, { limit: number; used: number }>();

export function setQuota(tenantId: string, limit: number) {
  quotas.set(tenantId, { limit, used: 0 });
}

export function checkQuota(tenantId: string, amount: number): boolean {
  const q = quotas.get(tenantId);
  if (!q) return true;
  return q.used + amount <= q.limit;
}

export function consumeQuota(tenantId: string, amount: number) {
  const q = quotas.get(tenantId);
  if (q) q.used += amount;
}
