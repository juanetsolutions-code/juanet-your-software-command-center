import { dealService } from "../services/deal-service";

export type PipelineHealth = {
  tenantId: string;
  totalDeals: number;
  stageDistribution: Record<string, number>;
  conversionRate: number;
  averageDealAge: number;
  bottlenecks: string[];
};

export class PipelineHealthAnalyzer {
  async analyze(tenantId: string): Promise<PipelineHealth> {
    const deals = await dealService.list(tenantId);
    const stageDistribution: Record<string, number> = {};

    for (const deal of deals) {
      stageDistribution[deal.stage] = (stageDistribution[deal.stage] ?? 0) + 1;
    }

    const wonDeals = deals.filter((d) => d.stage === "closed_won").length;
    const conversionRate = deals.length > 0 ? wonDeals / deals.length : 0;

    const avgAge = deals.reduce((sum, deal) => {
      if (!deal.createdAt) return sum;
      const days = Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / deals.length;

    const bottlenecks = this.identifyBottlenecks(stageDistribution, deals);

    return {
      tenantId,
      totalDeals: deals.length,
      stageDistribution,
      conversionRate,
      averageDealAge: avgAge,
      bottlenecks,
    };
  }

  private identifyBottlenecks(stages: Record<string, number>, deals: { stage: string; updatedAt?: string }[]): string[] {
    const bottlenecks: string[] = [];

    const stalledNegotiation = deals.filter((d) => {
      if (!d.updatedAt) return false;
      const days = Math.floor((Date.now() - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return d.stage === "negotiation" && days > 14;
    });

    if (stalledNegotiation.length > 2) {
      bottlenecks.push("Negotiation stage has stalled deals");
    }

    const stalledQualified = deals.filter((d) => {
      if (!d.updatedAt) return false;
      const days = Math.floor((Date.now() - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return d.stage === "qualified" && days > 7;
    });

    if (stalledQualified.length > 3) {
      bottlenecks.push("Qualified leads not being contacted");
    }

    return bottlenecks;
  }
}