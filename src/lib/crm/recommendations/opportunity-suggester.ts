import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type Opportunity = {
  id: string;
  type: "upsell" | "cross_sell" | "referral" | "expansion";
  entityId: string;
  title: string;
  estimatedValue: number;
  confidence: "low" | "medium" | "high";
  reason: string;
};

export class OpportunitySuggester {
  suggest(lead: Lead, deals: Deal[]): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    if (lead.score && lead.score > 80 && lead.status !== "converted") {
      opportunities.push({
        id: `opp_${lead.id}_referral`,
        type: "referral",
        entityId: lead.id,
        title: "Referral opportunity",
        estimatedValue: lead.value ?? 5000,
        confidence: lead.score > 90 ? "high" : "medium",
        reason: "High-scoring lead may provide referrals",
      });
    }
    
    return opportunities;
  }

  suggestForDeal(deal: Deal): Opportunity[] {
    const opportunities: Opportunity[] = [];
    
    if (deal.stage === "closed_won") {
      opportunities.push({
        id: `opp_${deal.id}_upsell`,
        type: "upsell",
        entityId: deal.accountId ?? deal.id,
        title: "Upsell opportunity",
        estimatedValue: deal.value * 0.3,
        confidence: "medium",
        reason: "Recent win - potential for additional services",
      });
    }
    
    return opportunities;
  }
}

export const opportunitySuggester = new OpportunitySuggester();