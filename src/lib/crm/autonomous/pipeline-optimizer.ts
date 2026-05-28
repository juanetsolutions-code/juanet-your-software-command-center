import { dealService } from "@/lib/crm/services/deal-service";

export type PipelineMetrics = {
  stageCounts: Record<string, number>;
  conversionRate: number;
  avgDealValue: number;
  stalledDeals: number;
};

export class PipelineOptimizer {
  async optimize(tenantId: string): Promise<PipelineMetrics> {
    const deals = await dealService.list(tenantId);
    
    const metrics: PipelineMetrics = {
      stageCounts: {},
      conversionRate: 0,
      avgDealValue: 0,
      stalledDeals: 0,
    };

    for (const deal of deals) {
      metrics.stageCounts[deal.stage] = (metrics.stageCounts[deal.stage] ?? 0) + 1;
    }

    const totalDeals = deals.length;
    const wonDeals = deals.filter((d) => d.stage === "closed_won").length;
    metrics.conversionRate = totalDeals > 0 ? wonDeals / totalDeals : 0;
    
    metrics.avgDealValue = deals.reduce((sum, d) => sum + d.value, 0) / totalDeals;

    const now = Date.now();
    metrics.stalledDeals = deals.filter((d) => {
      if (!d.updatedAt) return false;
      const days = (now - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return days > 14 && d.stage !== "closed_won" && d.stage !== "closed_lost";
    }).length;

    return metrics;
  }

  suggestOptimizations(metrics: PipelineMetrics): string[] {
    const suggestions: string[] = [];

    if (metrics.stalledDeals > 5) {
      suggestions.push("Too many stalled deals - consider follow-up automation");
    }

    const avgConversion = Object.values(metrics.stageCounts).reduce((a, b) => a + b, 0);
    const conversionRate = avgConversion > 0 ? (metrics.stageCounts["closed_won"] ?? 0) / avgConversion : 0;
    
    if (conversionRate < 0.1) {
      suggestions.push("Low conversion rate - review lead qualification process");
    }

    return suggestions;
  }
}