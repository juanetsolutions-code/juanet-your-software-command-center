import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type DailySummary = {
  date: string;
  tenantId: string;
  totalLeads: number;
  convertedLeads: number;
  totalDeals: number;
  closedWon: number;
  totalRevenue: number;
  topActions: Array<{ entityId: string; action: string }>;
  risks: string[];
};

export class DailySummaryGenerator {
  generate(tenantId: string, leads: Lead[], deals: Deal[]): DailySummary {
    return {
      date: new Date().toISOString(),
      tenantId,
      totalLeads: leads.length,
      convertedLeads: leads.filter(l => l.status === "converted").length,
      totalDeals: deals.length,
      closedWon: deals.filter(d => d.stage === "closed_won").length,
      totalRevenue: deals.filter(d => d.stage === "closed_won").reduce((sum, d) => sum + d.value, 0),
      topActions: this.getTopActions(leads, deals),
      risks: this.getRisks(deals),
    };
  }

  private getTopActions(leads: Lead[], deals: Deal[]): Array<{ entityId: string; action: string }> {
    const actions: Array<{ entityId: string; action: string }> = [];
    
    const hotLeads = leads.filter(l => (l.score ?? 0) > 75).slice(0, 3);
    hotLeads.forEach(l => actions.push({ entityId: l.id, action: "follow_up_hot_lead" }));
    
    const closingDeals = deals.filter(d => {
      if (!d.expectedCloseDate) return false;
      const days = Math.floor((new Date(d.expectedCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 3;
    }).slice(0, 2);
    closingDeals.forEach(d => actions.push({ entityId: d.id, action: "follow_up_closing_deal" }));
    
    return actions;
  }

  private getRisks(deals: Deal[]): string[] {
    const risks: string[] = [];
    const stalled = deals.filter(d => {
      if (!d.updatedAt) return false;
      const days = Math.floor((Date.now() - new Date(d.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      return days > 7 && d.stage !== "closed_won" && d.stage !== "closed_lost";
    });
    
    if (stalled.length > 0) {
      risks.push(`${stalled.length} stalled deals`);
    }
    
    return risks;
  }
}

export const dailySummary = new DailySummaryGenerator();