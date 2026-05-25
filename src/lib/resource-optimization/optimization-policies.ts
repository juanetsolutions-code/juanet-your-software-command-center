/**
 * Optimization Policies
 * Declarative policies that govern how optimization decisions are made.
 */

export interface OptimizationPolicy {
  id: string;
  name: string;
  tenantId?: string; // null = platform default
  maxCostIncreasePercent: number;
  minPerformanceThreshold: number;
  allowedActions: string[];
  autoApply: boolean;
  priority: number;
}

export const defaultOptimizationPolicies: OptimizationPolicy[] = [
  {
    id: "platform-default",
    name: "Platform Conservative",
    maxCostIncreasePercent: 12,
    minPerformanceThreshold: 0.75,
    allowedActions: ["scale_down", "rebalance", "cache_warm"],
    autoApply: false,
    priority: 0,
  },
  {
    id: "enterprise-perf",
    name: "Enterprise Performance First",
    maxCostIncreasePercent: 35,
    minPerformanceThreshold: 0.92,
    allowedActions: ["scale_up", "rebalance", "provision_premium"],
    autoApply: true,
    priority: 10,
  },
];

export class OptimizationPolicies {
  resolveForTenant(tenantId: string, tier: string): OptimizationPolicy {
    if (tier === "enterprise") {
      return defaultOptimizationPolicies.find((p) => p.id === "enterprise-perf")!;
    }
    return defaultOptimizationPolicies[0];
  }
}

export const optimizationPolicies = new OptimizationPolicies();
