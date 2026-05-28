import type { Deal } from "../core/crm-entities";

export class DealHealthScoring {
  calculate(deal: Deal, daysSinceActivity: number): number {
    let score = 100;
    
    if (deal.probability < 25) score -= 30;
    else if (deal.probability < 50) score -= 15;
    
    if (daysSinceActivity > 14) score -= 40;
    else if (daysSinceActivity > 7) score -= 20;
    
    if (deal.stage === "prospecting") score -= 10;
    
    return Math.max(0, score);
  }

  getStatus(deal: Deal, daysSinceActivity: number): "healthy" | "at_risk" | "stalled" {
    const score = this.calculate(deal, daysSinceActivity);
    if (score >= 70) return "healthy";
    if (score >= 40) return "at_risk";
    return "stalled";
  }
}

export const dealHealthScoring = new DealHealthScoring();