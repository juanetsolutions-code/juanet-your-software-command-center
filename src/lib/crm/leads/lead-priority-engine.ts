import type { Lead } from "../core/crm-entities";
import { LeadScoringEngine } from "./lead-scoring-engine";
import { LeadClassifier } from "./lead-classification";

export type PriorityEntry = {
  leadId: string;
  priority: number;
  tier: string;
  nextAction: string;
};

export class LeadPriorityEngine {
  private scorer = new LeadScoringEngine();
  private classifier = new LeadClassifier();

  prioritize(leads: Lead[]): PriorityEntry[] {
    return leads.map((lead) => {
      const score = this.scorer.score(lead);
      const classification = this.classifier.classify(lead);
      
      return {
        leadId: lead.id,
        priority: score.score,
        tier: classification.tier,
        nextAction: this.getNextAction(classification.tier, lead),
      };
    }).sort((a, b) => b.priority - a.priority);
  }

  private getNextAction(tier: string, lead: Lead): string {
    switch (tier) {
      case "ready": return "immediate_call";
      case "hot": return "next_morning_followup";
      case "warm": return "nurture_sequence";
      default: return "monitor";
    }
  }

  getTopLeads(leads: Lead[], count: number): PriorityEntry[] {
    return this.prioritize(leads).slice(0, count);
  }
}