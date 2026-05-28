import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type ConversionFunnel = {
  stage: string;
  count: number;
  conversionRate: number;
};

export class ConversionAnalytics {
  calculateFunnel(leads: Lead[]): ConversionFunnel[] {
    const stages = ["new", "contacted", "qualified", "proposal", "converted"];
    const counts = stages.map((s) => leads.filter((l) => l.status === s).length);
    
    let total = leads.length;
    return stages.map((stage, i) => {
      const count = counts[i];
      const rate = total > 0 ? count / total : 0;
      return { stage, count, conversionRate: rate };
    });
  }

  calculateWinRate(deals: Deal[]): number {
    const won = deals.filter((d) => d.stage === "closed_won").length;
    return deals.length > 0 ? won / deals.length : 0;
  }

  averageDealCycle(deals: Deal[]): number {
    const completed = deals.filter((d) => d.actualCloseDate);
    if (completed.length === 0) return 0;
    
    const totalDays = completed.reduce((sum, deal) => {
      const created = new Date(deal.createdAt);
      const closed = new Date(deal.actualCloseDate!);
      return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    }, 0);
    
    return totalDays / completed.length;
  }
}

export const conversionAnalytics = new ConversionAnalytics();