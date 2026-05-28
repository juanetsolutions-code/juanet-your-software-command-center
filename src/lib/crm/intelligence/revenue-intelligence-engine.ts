import type { Deal } from "../core/crm-entities";
import type { Pipeline } from "../core/crm-entities";

export type RevenuePrediction = {
  period: string;
  predictedRevenue: number;
  confidence: "low" | "medium" | "high";
  dealsIncluded: number;
  upsidePotential: number;
};

export type DealRiskScore = {
  dealId: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  factors: string[];
  suggestedActions: string[];
};

export class RevenueIntelligenceEngine {
  async predictRevenue(deals: Deal[], pipeline: Pipeline): Promise<RevenuePrediction> {
    const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
    
    let weightedRevenue = 0;
    let totalPotential = 0;
    
    for (const deal of activeDeals) {
      const stage = pipeline.stages.find((s) => s.name.toLowerCase() === deal.stage.toLowerCase());
      const probability = stage?.probability ?? deal.probability ?? 50;
      weightedRevenue += deal.value * probability / 100;
      totalPotential += deal.value;
    }
    
    const confidence = activeDeals.length > 20 ? "high" : activeDeals.length > 5 ? "medium" : "low";
    const upsidePotential = totalPotential - weightedRevenue;
    
    return {
      period: "current_quarter",
      predictedRevenue: weightedRevenue,
      confidence,
      dealsIncluded: activeDeals.length,
      upsidePotential,
    };
  }

  assessDealRisk(deal: Deal, daysSinceUpdate?: number): DealRiskScore {
    const factors: string[] = [];
    let riskScore = 0;
    
    const days = daysSinceUpdate ?? 0;
    
    if (days > 14) {
      factors.push("No activity in 14+ days");
      riskScore += 40;
    } else if (days > 7) {
      factors.push("No activity in 7+ days");
      riskScore += 25;
    }
    
    if (deal.probability < 30) {
      factors.push("Low probability");
      riskScore += 30;
    }
    
    if (deal.stage === "prospecting" && days > 3) {
      factors.push("Stuck in prospecting");
      riskScore += 20;
    }
    
    const riskLevel = riskScore > 70 ? "critical" : riskScore > 40 ? "high" : riskScore > 20 ? "medium" : "low";
    
    const suggestedActions = this.getSuggestedActions(riskLevel, factors);
    
    return {
      dealId: deal.id,
      riskLevel,
      riskScore,
      factors,
      suggestedActions,
    };
  }

  private getSuggestedActions(riskLevel: string, factors: string[]): string[] {
    const actions: string[] = [];
    
    if (riskLevel === "critical" || riskLevel === "high") {
      actions.push("Immediate follow-up required");
      actions.push("Schedule call within 24 hours");
    }
    
    if (factors.includes("Stuck in prospecting")) {
      actions.push("Request executive introduction");
      actions.push("Offer pilot program");
    }
    
    return actions;
  }
}

export const revenueIntelligence = new RevenueIntelligenceEngine();