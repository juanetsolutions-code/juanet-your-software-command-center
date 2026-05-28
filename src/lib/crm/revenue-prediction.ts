import { dealService } from "./services/deal-service";
import type { Deal } from "./core/crm-entities";

export type RevenuePrediction = {
  period: "week" | "month" | "quarter";
  predicted: number;
  confidence: number;
  topDeals: Deal[];
};

export class RevenuePredictionEngine {
  async predict(tenantId: string, period: "week" | "month" | "quarter" = "month"): Promise<RevenuePrediction> {
    const deals = await dealService.list(tenantId);
    const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");

    const totalWeighted = activeDeals.reduce((sum, deal) => {
      return sum + (deal.value * (deal.probability ?? 50) / 100);
    }, 0);

    const topDeals = [...activeDeals]
      .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
      .slice(0, 5);

    return {
      period,
      predicted: totalWeighted,
      confidence: Math.min(0.95, 0.5 + (activeDeals.length * 0.05)),
      topDeals,
    };
  }
}