/**
 * Subscription Types
 * Core domain models for SaaS subscription management.
 * Tenant-aware and plan-based.
 */

export type PlanTier = "free" | "pro" | "business" | "enterprise";

export interface SubscriptionPlan {
  id: string;
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: Record<string, number>;
}

export interface TenantSubscription {
  tenantId: string;
  planId: string;
  tier: PlanTier;
  status: "active" | "past_due" | "canceled" | "trialing";
  startedAt: string;
  endsAt?: string;
  billingCycle: "monthly" | "yearly";
  metadata?: Record<string, unknown>;
}

export interface Entitlement {
  feature: string;
  enabled: boolean;
  limit?: number;
  used?: number;
}

export interface QuotaUsage {
  tenantId: string;
  resource: string;
  used: number;
  limit: number;
  resetAt?: string;
}
