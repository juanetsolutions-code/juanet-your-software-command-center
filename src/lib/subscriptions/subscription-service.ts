/**
 * Subscription Service
 * High-level service for managing tenant subscriptions.
 * This is the main entry point for subscription operations.
 */

import type { TenantSubscription, PlanTier } from "./subscription-types";
import { getPlan } from "./plan-registry";
import { resolveEntitlements } from "./entitlement-engine";

const subscriptions = new Map<string, TenantSubscription>(); // tenantId -> subscription

export function getSubscription(tenantId: string): TenantSubscription | null {
  return subscriptions.get(tenantId) ?? null;
}

export function subscribeTenant(tenantId: string, tier: PlanTier): TenantSubscription {
  const plan = getPlan(tier);

  const subscription: TenantSubscription = {
    tenantId,
    planId: plan.id,
    tier,
    status: "active",
    startedAt: new Date().toISOString(),
    billingCycle: "monthly",
  };

  subscriptions.set(tenantId, subscription);
  return subscription;
}

export function changePlan(tenantId: string, newTier: PlanTier): TenantSubscription | null {
  const current = subscriptions.get(tenantId);
  if (!current) return null;

  const plan = getPlan(newTier);
  const updated: TenantSubscription = {
    ...current,
    planId: plan.id,
    tier: newTier,
  };

  subscriptions.set(tenantId, updated);
  return updated;
}

export function getEntitlements(tenantId: string) {
  const sub = getSubscription(tenantId);
  if (!sub) return [];
  return resolveEntitlements(sub);
}

export function cancelSubscription(tenantId: string): boolean {
  const sub = subscriptions.get(tenantId);
  if (!sub) return false;

  sub.status = "canceled";
  sub.endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days grace
  return true;
}
