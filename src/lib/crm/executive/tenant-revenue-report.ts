import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type TenantRevenueReport = {
  tenantId: string;
  period: string;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  forecast: number;
  growth: number;
};

export class TenantRevenueReport {
  generate(tenantId: string, leads: Lead[], deals: Deal[]): TenantRevenueReport {
    const revenue = deals.filter(d => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0);
    const forecast = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost")
      .reduce((sum, d) => sum + (d.value * d.probability / 100), 0);
    
    return {
      tenantId,
      period: "current_quarter",
      totalLeads: leads.length,
      totalDeals: deals.length,
      totalRevenue: revenue,
      forecast,
      growth: revenue > 0 ? forecast / revenue : 0,
    };
  }
}