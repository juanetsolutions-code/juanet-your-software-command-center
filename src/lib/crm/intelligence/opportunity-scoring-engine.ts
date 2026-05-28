import type { Lead } from "../core/crm-entities";

export type OpportunityScore = {
  leadId: string;
  score: number;
  tier: "A" | "B" | "C";
  reasons: string[];
};

export type ScoringWeights = {
  company: number;
  title: number;
  engagement: number;
  velocity: number;
  timeline: number;
};

export class OpportunityScoringEngine {
  private weights: ScoringWeights = {
    company: 30,
    title: 20,
    engagement: 25,
    velocity: 15,
    timeline: 10,
  };

  score(lead: Lead): OpportunityScore {
    let score = 50;
    const reasons: string[] = [];
    
    if (lead.company) {
      score += this.weights.company;
      reasons.push("Has company info");
    }
    
    if (lead.title) {
      score += this.weights.title;
      reasons.push("Has title");
    }
    
    if (lead.score && lead.score > 70) {
      score += this.weights.engagement;
      reasons.push("High behavioral score");
    }
    
    const tier = score >= 85 ? "A" : score >= 65 ? "B" : "C";
    
    return {
      leadId: lead.id,
      score,
      tier,
      reasons,
    };
  }

  rank(leads: Lead[]): OpportunityScore[] {
    return leads.map((lead) => this.score(lead)).sort((a, b) => b.score - a.score);
  }

  setWeights(weights: Partial<ScoringWeights>): void {
    this.weights = { ...this.weights, ...weights };
  }
}

export const opportunityScoring = new OpportunityScoringEngine();