import type { Deal } from "./core/crm-entities";

export type DealScore = {
  dealId: string;
  probability: number;
  health: "excellent" | "good" | "concerning" | "critical";
  factors: Record<string, number>;
};

export class DealScoringEngine {
  score(deal: Deal): DealScore {
    let probability = deal.probability ?? 50;
    const factors: Record<string, number> = {};

    if (deal.value > 10000) {
      factors.high_value = 20;
      probability += 20;
    } else if (deal.value > 5000) {
      factors.medium_value = 10;
      probability += 10;
    }

    if (deal.stage === "proposal") {
      factors.proposal_stage = 15;
      probability += 15;
    } else if (deal.stage === "negotiation") {
      factors.negotiation_stage = 25;
      probability += 25;
    }

    factors.base_score = probability;

    let health: DealScore["health"] = "good";
    if (probability >= 80) health = "excellent";
    else if (probability >= 50) health = "good";
    else if (probability >= 25) health = "concerning";
    else health = "critical";

    return {
      dealId: deal.id,
      probability: Math.min(Math.round(probability), 100),
      health,
      factors,
    };
  }
}