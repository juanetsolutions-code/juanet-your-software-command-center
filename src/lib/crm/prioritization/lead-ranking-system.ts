import type { Lead } from "../core/crm-entities";

export class LeadRankingSystem {
  rank(leads: Lead[], tenantId?: string): Lead[] {
    return leads.sort((a, b) => {
      const aScore = this.getCompositeScore(a);
      const bScore = this.getCompositeScore(b);
      return bScore - aScore;
    });
  }

  private getCompositeScore(lead: Lead): number {
    let score = lead.score ?? 50;
    
    const age = lead.lastContactedAt ? 
      Math.floor((Date.now() - new Date(lead.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    if (age > 3) score -= 20;
    if (age > 7) score -= 30;
    
    const hotTags = lead.tags?.filter(t => t === "hot" || t === "urgent");
    if (hotTags && hotTags.length > 0) score += 20;
    
    return Math.max(0, Math.min(100, score));
  }

  getHotLeads(leads: Lead[]): Lead[] {
    return this.rank(leads).filter(l => (l.score ?? 0) >= 70);
  }
}

export const leadRanking = new LeadRankingSystem();