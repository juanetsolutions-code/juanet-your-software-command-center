import type { Deal } from "@/lib/crm/core/crm-entities";
import type { Lead } from "@/lib/crm/core/crm-entities";

export type RevenueOpportunity = {
  id: string;
  type: "upsell" | "new_deal" | "reactivation" | "hot_lead";
  value: number;
  confidence: number;
  nextAction: string;
};

export class RevenueOpportunityFinder {
  find(tenantId: string, leads: Lead[], deals: Deal[]): RevenueOpportunity[] {
    const opportunities: RevenueOpportunity[] = [];

    for (const lead of leads) {
      if ((lead.score ?? 0) >= 80) {
        opportunities.push({
          id: `opp_${lead.id}`,
          type: "hot_lead",
          value: lead.value ?? 1000,
          confidence: 0.9,
          nextAction: "immediate_call",
        });
      }
    }

    for (const deal of deals) {
      if ((deal.probability ?? 0) > 70 && deal.stage !== "closed_won") {
        opportunities.push({
          id: `opp_${deal.id}`,
          type: "new_deal",
          value: deal.value,
          confidence: deal.probability / 100,
          nextAction: "schedule_closing",
        });
      }
    }

    return opportunities.sort((a, b) => b.value - a.value).slice(0, 10);
  }
}