import type { Deal } from "../../core/crm-entities";

export type DealScoreModel = {
  dealId: string;
  probability: number;
  health: "excellent" | "good" | "concerning" | "critical";
  factors: Record<string, number>;
};

export class DealScoreModelEngine {
  score(deal: Deal): DealScoreModel {
    let probability = deal.probability ?? 50;
    const factors: Record<string, number> = {};

    factors.base_probability = probability;

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

    if (deal.updatedAt) {
      const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (days > 14) {
        factors.stale = -20;
        probability -= 20;
      } else if (days > 7) {
        factors.slightly_stale = -10;
        probability -= 10;
      }
    }

    let health: DealScoreModel["health"] = "good";
    if (probability >= 80) health = "excellent";
    else if (probability >= 50) health = "good";
    else if (probability >= 25) health = "concerning";
    else health = "critical";

    return {
      dealId: deal.id,
      probability: Math.min(Math.max(Math.round(probability), 0), 100),
      health,
      factors,
    };
  }
}