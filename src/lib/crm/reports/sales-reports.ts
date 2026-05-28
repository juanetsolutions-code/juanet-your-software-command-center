import type { Deal } from "../core/crm-entities";
import type { Pipeline } from "../core/crm-entities";

export type SalesReport = {
  period: "daily" | "weekly" | "monthly" | "quarterly";
  startDate: string;
  endDate: string;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  wonDeals: number;
  lostDeals: number;
  conversionRate: number;
};

export class SalesReports {
  async generate(tenantId: string, period: "daily" | "weekly" | "monthly"): Promise<SalesReport> {
    return {
      period,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
      totalLeads: 0,
      totalDeals: 0,
      totalRevenue: 0,
      wonDeals: 0,
      lostDeals: 0,
      conversionRate: 0,
    };
  }

  async getRevenueByStage(deals: Deal[], pipeline: Pipeline): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    for (const stage of pipeline.stages) {
      result[stage.name] = deals
        .filter((d) => d.stage.toLowerCase() === stage.name.toLowerCase())
        .reduce((sum, d) => sum + d.value, 0);
    }
    return result;
  }
}

export const salesReports = new SalesReports();