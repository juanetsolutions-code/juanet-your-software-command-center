import { dealService } from "../services/deal-service";
import type { Deal } from "../core/crm-entities";
import { emitEvent } from "@/lib/event-bus";

export type RevenueForecast = {
  period: string;
  predicted: number;
  confidence: number;
  dealsInPipeline: number;
};

export class RevenueForecastEngine {
  async forecast(tenantId: string, period: "month" | "quarter" = "month"): Promise<RevenueForecast> {
    const deals = await dealService.list(tenantId);
    const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");

    const totalWeightedValue = activeDeals.reduce((sum, deal) => {
      const probability = deal.probability ?? 0;
      return sum + (deal.value * probability / 100);
    }, 0);

    const confidence = this.calculateConfidence(activeDeals.length);

    return {
      period: period,
      predicted: totalWeightedValue,
      confidence,
      dealsInPipeline: activeDeals.length,
    };
  }

  private calculateConfidence(dealCount: number): number {
    return Math.min(0.95, 0.5 + (dealCount * 0.05));
  }
}