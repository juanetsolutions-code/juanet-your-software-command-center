import type { Deal } from "../core/crm-entities";
import type { Pipeline } from "../core/crm-entities";

export type PipelineHealth = {
  score: number;
  issues: string[];
  recommendations: string[];
};

export class PipelineAnalytics {
  assessHealth(deals: Deal[], pipeline: Pipeline): PipelineHealth {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    const stageValues = this.getStageValueDistribution(deals, pipeline);
    const stalledDeals = this.getStalledDeals(deals);
    
    if (stalledDeals.length > 3) {
      issues.push(`${stalledDeals.length} deals haven't progressed in 7+ days`);
      recommendations.push("Review stalled deals with sales team");
    }
    
    const score = Math.max(0, 100 - issues.length * 25);
    
    return { score, issues, recommendations };
  }

  getStageValueDistribution(deals: Deal[], pipeline: Pipeline): Record<string, number> {
    const dist: Record<string, number> = {};
    for (const stage of pipeline.stages) {
      dist[stage.name] = deals
        .filter((d) => d.stage === stage.name)
        .reduce((sum, d) => sum + d.value, 0);
    }
    return dist;
  }

  getStalledDeals(deals: Deal[], days: number = 7): Deal[] {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return deals.filter((d) => {
      if (!d.updatedAt) return false;
      return new Date(d.updatedAt).getTime() < cutoff && d.stage !== "closed_won" && d.stage !== "closed_lost";
    });
  }

  forecastRevenue(deals: Deal[]): number {
    return deals
      .filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost")
      .reduce((sum, deal) => sum + (deal.value * (deal.probability || 0) / 100), 0);
  }
}

export const pipelineAnalytics = new PipelineAnalytics();