import type { Deal } from "../core/crm-entities";

export type PipelineState = {
  stage: string;
  probability: number;
  confidence: number;
  lastUpdated: string;
};

export class PipelineStateMachine {
  private validTransitions: Record<string, string[]> = {
    lead: ["qualified", "closed_lost"],
    qualified: ["contacted", "closed_lost"],
    contacted: ["negotiation", "qualified", "closed_lost"],
    negotiation: ["closed_won", "closed_lost", "contacted"],
  };

  canTransition(from: string, to: string): boolean {
    const valid = this.validTransitions[from] ?? [];
    return valid.includes(to);
  }

  calculateState(deal: Deal): PipelineState {
    return {
      stage: deal.stage,
      probability: this.deriveProbability(deal),
      confidence: this.calculateConfidence(deal),
      lastUpdated: deal.updatedAt ?? deal.createdAt,
    };
  }

  private deriveProbability(deal: Deal): number {
    const base = deal.probability ?? 50;
    let adjusted = base;

    if (deal.stage === "lead") adjusted *= 0.3;
    else if (deal.stage === "qualified") adjusted *= 0.5;
    else if (deal.stage === "contacted") adjusted *= 0.8;
    else if (deal.stage === "negotiation") adjusted *= 1.2;

    return Math.min(Math.round(adjusted), 100);
  }

  private calculateConfidence(deal: Deal): number {
    const days = deal.updatedAt 
      ? Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return days < 7 ? 0.9 : days < 14 ? 0.7 : 0.5;
  }
}