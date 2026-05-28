import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type WeeklyInsights = {
  weekStart: string;
  tenantId: string;
  conversionRate: number;
  avgDealSize: number;
  topPerformer?: string;
  trends: Array<{ metric: string; change: number }>;
};

export class WeeklySalesInsights {
  generate(tenantId: string, leads: Lead[], deals: Deal[]): WeeklyInsights {
    const converted = leads.filter(l => l.status === "converted").length;
    const rate = leads.length > 0 ? converted / leads.length : 0;
    
    const wonDeals = deals.filter(d => d.stage === "closed_won");
    const avg = wonDeals.length > 0 ? wonDeals.reduce((s, d) => s + d.value, 0) / wonDeals.length : 0;
    
    return {
      weekStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      tenantId,
      conversionRate: rate,
      avgDealSize: avg,
      trends: this.getTrends(leads, deals),
    };
  }

  private getTrends(leads: Lead[], deals: Deal[]): Array<{ metric: string; change: number }> {
    return [
      { metric: "lead_volume", change: leads.length > 15 ? 0.15 : -0.05 },
      { metric: "avg_deal_size", change: deals.length > 5 ? 0.08 : 0 },
    ];
  }
}

export const weeklyInsights = new WeeklySalesInsights();