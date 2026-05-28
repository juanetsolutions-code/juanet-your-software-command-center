import type { Lead } from "@/lib/crm/core/crm-entities";
import type { Deal } from "@/lib/crm/core/crm-entities";

export type SalesSummary = {
  todaysActions: number;
  hotLeads: Lead[];
  topDeals: Deal[];
  revenueForecast: number;
};

export class DailySalesSummary {
  async generate(tenantId: string): Promise<SalesSummary> {
    const leads = await import("@/lib/crm/services/lead-service").then(m => m.leadService.list(tenantId));
    const deals = await import("@/lib/crm/services/deal-service").then(m => m.dealService.list(tenantId));

    const hotLeads = leads.filter((l) => (l.score ?? 0) >= 70).slice(0, 5);
    const topDeals = deals
      .filter((d) => d.stage !== "closed_lost")
      .sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))
      .slice(0, 5);

    const revenueForecast = topDeals.reduce((sum, deal) => {
      return sum + (deal.value * (deal.probability ?? 50) / 100);
    }, 0);

    return {
      todaysActions: hotLeads.length + topDeals.length,
      hotLeads,
      topDeals,
      revenueForecast,
    };
  }
}