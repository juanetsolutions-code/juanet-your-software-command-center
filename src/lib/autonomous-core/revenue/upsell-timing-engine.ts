import type { Deal } from "@/lib/crm/core/crm-entities";
import { dealService } from "@/lib/crm/services/deal-service";

export type UpsellTiming = {
  accountId: string;
  recommendedAt: string;
  probability: number;
  suggestedDeal?: string;
};

export class UpsellTimingEngine {
  evaluate(tenantId: string): UpsellTiming[] {
    const deals = dealService.list(tenantId) as Promise<Deal[]>;
    return [];
  }

  private calculateUpsellProbability(deal: Deal): number {
    const daysOld = deal.createdAt 
      ? Math.floor((Date.now() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    let probability = 0;

    if (deal.stage === "closed_won") probability += 40;
    if (daysOld > 90) probability += 20;
    if ((deal.value ?? 0) > 5000) probability += 15;

    return Math.min(probability, 100);
  }
}