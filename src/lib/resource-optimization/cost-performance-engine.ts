/**
 * Cost-Performance Engine
 * Balances cost vs performance objectives per tenant and workload class.
 */

export interface CostPerformanceAnalysis {
  tenantId: string;
  currentMonthlyCost: number;
  projectedMonthlyCost: number;
  performanceScore: number;
  efficiencyRatio: number;
  recommendedActions: string[];
}

export class CostPerformanceEngine {
  analyze(
    tenantId: string,
    usage: Record<string, number>,
    priceModel: Record<string, number>,
  ): CostPerformanceAnalysis {
    const cost = Object.keys(usage).reduce(
      (sum, k) => sum + (usage[k] || 0) * (priceModel[k] || 0.05),
      0,
    );
    const perf = Math.min(0.98, 0.6 + (usage.cpu_util || 0.3) * 0.4);

    return {
      tenantId,
      currentMonthlyCost: cost,
      projectedMonthlyCost: cost * 1.08,
      performanceScore: perf,
      efficiencyRatio: perf / Math.max(0.01, cost / 100),
      recommendedActions:
        perf < 0.7 ? ["optimize_queries", "enable_caching"] : ["review_reserved_capacity"],
    };
  }
}

export const costPerformanceEngine = new CostPerformanceEngine();
