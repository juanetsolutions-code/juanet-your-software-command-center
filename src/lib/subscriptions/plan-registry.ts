/**
 * Plan Registry
 * Central registry of available subscription plans.
 * Supports Free, Pro, Business, Enterprise tiers.
 */

import type { SubscriptionPlan, PlanTier } from "./subscription-types";

const plans: Record<PlanTier, SubscriptionPlan> = {
  free: {
    id: "plan_free",
    tier: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    features: ["basic_projects", "limited_requests", "community_support"],
    limits: { projects: 3, requests: 10, storageGB: 1, aiCalls: 50 },
  },
  pro: {
    id: "plan_pro",
    tier: "pro",
    name: "Pro",
    priceMonthly: 29,
    priceYearly: 290,
    features: ["unlimited_projects", "advanced_automations", "priority_support", "ai_assistant"],
    limits: { projects: 50, requests: 500, storageGB: 50, aiCalls: 1000 },
  },
  business: {
    id: "plan_business",
    tier: "business",
    name: "Business",
    priceMonthly: 79,
    priceYearly: 790,
    features: ["team_workspaces", "sso_ready", "advanced_analytics", "custom_integrations"],
    limits: { projects: 200, requests: 2000, storageGB: 200, aiCalls: 5000 },
  },
  enterprise: {
    id: "plan_enterprise",
    tier: "enterprise",
    name: "Enterprise",
    priceMonthly: 199,
    priceYearly: 1990,
    features: ["unlimited_everything", "dedicated_support", "on_premise_option", "custom_sla"],
    limits: { projects: -1, requests: -1, storageGB: 1000, aiCalls: 20000 },
  },
};

export function getPlan(tier: PlanTier): SubscriptionPlan {
  return plans[tier];
}

export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(plans);
}

export function isFeatureIncluded(tier: PlanTier, feature: string): boolean {
  return plans[tier].features.includes(feature);
}
