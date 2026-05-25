/**
 * Intelligent Resource Optimization Layer - Compute Optimizer
 * Prepares intelligent compute allocation and future autoscaling signals.
 */

export interface ResourceRecommendation {
  tenantId: string;
  service: string;
  currentUtilization: number;
  recommendedChange: "scale_up" | "scale_down" | "rebalance" | "no_change";
  magnitude: number;
  rationale: string;
  expectedCostDelta: number;
  confidence: number;
}

export class ComputeOptimizer {
  recommend(tenantId: string, current: Record<string, number>): ResourceRecommendation[] {
    const recs: ResourceRecommendation[] = [];

    Object.entries(current).forEach(([svc, util]) => {
      if (util > 0.85) {
        recs.push({
          tenantId,
          service: svc,
          currentUtilization: util,
          recommendedChange: "scale_up",
          magnitude: 1.3,
          rationale: "High sustained utilization",
          expectedCostDelta: 18,
          confidence: 0.83,
        });
      } else if (util < 0.25) {
        recs.push({
          tenantId,
          service: svc,
          currentUtilization: util,
          recommendedChange: "scale_down",
          magnitude: 0.6,
          rationale: "Low utilization - cost optimization opportunity",
          expectedCostDelta: -12,
          confidence: 0.76,
        });
      }
    });

    return recs;
  }
}

export const computeOptimizer = new ComputeOptimizer();
