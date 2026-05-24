/**
 * Entitlement Engine
 * Resolves what features and limits a tenant is entitled to based on their subscription.
 */

import type { Entitlement, TenantSubscription } from "./subscription-types";
import { getPlan } from "./plan-registry";

export function resolveEntitlements(subscription: TenantSubscription): Entitlement[] {
  const plan = getPlan(subscription.tier);
  const entitlements: Entitlement[] = [];

  // Convert plan features to entitlements
  plan.features.forEach((feature) => {
    entitlements.push({
      feature,
      enabled: true,
      limit: plan.limits[feature] ?? undefined,
    });
  });

  // Add quota-based entitlements
  Object.entries(plan.limits).forEach(([resource, limit]) => {
    entitlements.push({
      feature: resource,
      enabled: limit !== 0,
      limit: limit === -1 ? undefined : limit, // -1 means unlimited
    });
  });

  return entitlements;
}

export function hasEntitlement(subscription: TenantSubscription, feature: string): boolean {
  const entitlements = resolveEntitlements(subscription);
  const match = entitlements.find((e) => e.feature === feature);
  return !!match?.enabled;
}
