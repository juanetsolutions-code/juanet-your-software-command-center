/**
 * Quota Enforcement
 * Prepares enforcement logic for usage limits (to be wired into repositories/services).
 */

import type { QuotaUsage, TenantSubscription } from "./subscription-types";
import { getPlan } from "./plan-registry";

const usageStore: Record<string, Record<string, number>> = {}; // tenantId -> resource -> used

export function getQuotaUsage(tenantId: string, resource: string): QuotaUsage {
  const used = usageStore[tenantId]?.[resource] ?? 0;
  // In real impl, this would come from billing/usage-metering
  return {
    tenantId,
    resource,
    used,
    limit: 0, // will be resolved from subscription
  };
}

export function checkQuota(
  subscription: TenantSubscription,
  resource: string,
  amount = 1,
): boolean {
  const plan = getPlan(subscription.tier);
  const limit = plan.limits[resource] ?? 0;

  if (limit === -1) return true; // unlimited

  const used = usageStore[subscription.tenantId]?.[resource] ?? 0;
  return used + amount <= limit;
}

export function recordUsage(tenantId: string, resource: string, amount = 1): void {
  if (!usageStore[tenantId]) usageStore[tenantId] = {};
  usageStore[tenantId][resource] = (usageStore[tenantId][resource] ?? 0) + amount;
}
