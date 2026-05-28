import type { Deal } from "../core/crm-entities";

export type Forecast = {
  period: string;
  predictedRevenue: number;
  confidence: "low" | "medium" | "high";
  dealsCounted: number;
};

export class ForecastEngine {
  generate(deals: Deal[], period: "30d" | "60d" | "90d"): Forecast {
    const activeDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
    
    const totalValue = activeDeals.reduce((sum, d) => {
      const prob = d.probability || 50;
      return sum + (d.value * prob / 100);
    }, 0);
    
    const confidence = activeDeals.length > 10 ? "high" : activeDeals.length > 5 ? "medium" : "low";
    
    return {
      period,
      predictedRevenue: totalValue,
      confidence,
      dealsCounted: activeDeals.length,
    };
  }

  generateHistorical(deals: Deal[]): number {
    return deals
      .filter((d) => d.stage === "closed_won")
      .reduce((sum, d) => sum + d.value, 0);
  }
}

export const forecastEngine = new ForecastEngine();