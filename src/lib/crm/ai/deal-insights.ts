import type { Deal, Pipeline } from "../core/crm-entities";

export type DealInsight = {
  dealId: string;
  probabilityScore: number;
  riskLevel: "low" | "medium" | "high";
  nextSteps: string[];
  forecastImpact: number;
};

export class DealInsights {
  async analyze(deal: Deal, pipeline: Pipeline): Promise<DealInsight> {
    const stage = pipeline.stages.find((s) => s.name.toLowerCase() === deal.stage.toLowerCase());
    const probability = stage?.probability ?? deal.probability ?? 0;

    let riskLevel: "low" | "medium" | "high" = "medium";
    if (probability < 25) riskLevel = "high";
    else if (probability > 75) riskLevel = "low";

    const nextSteps: string[] = [];
    const currentStage = pipeline.stages.find((s) => s.id === deal.stage || s.name.toLowerCase() === deal.stage.toLowerCase());
    const nextStage = pipeline.stages.find((s) => s.position === (currentStage?.position ?? 0) + 1);
    
    if (nextStage) {
      nextSteps.push(`Move to ${nextStage.name}`);
    }

    if (deal.expectedCloseDate) {
      const daysUntilClose = this.daysUntil(new Date(deal.expectedCloseDate));
      if (daysUntilClose < 0) {
        nextSteps.push("Deal is overdue - follow up immediately");
        riskLevel = "high";
      }
    }

    return {
      dealId: deal.id,
      probabilityScore: probability,
      riskLevel,
      nextSteps,
      forecastImpact: deal.value * probability / 100,
    };
  }

  private daysUntil(date: Date): number {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  async batchAnalyze(deals: Deal[], pipeline: Pipeline): Promise<DealInsight[]> {
    return Promise.all(deals.map((deal) => this.analyze(deal, pipeline)));
  }
}

export const dealInsights = new DealInsights();