import type { Deal } from "../core/crm-entities";
import type { Signal } from "../signals/signal-engine";

export type StageTransition = {
  from: string;
  to: string;
  condition: string;
  confidence: number;
};

export class StageTransitionLogic {
  evaluate(deal: Deal, signals: Signal[]): StageTransition | null {
    const daysInactive = deal.updatedAt 
      ? Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    if (deal.stage === "lead" && (deal.probability ?? 0) > 50) {
      return { from: "lead", to: "qualified", condition: "high_probability", confidence: 0.8 };
    }

    if (deal.stage === "qualified" && signals.some(s => s.type === "high_intent")) {
      return { from: "qualified", to: "contacted", condition: "intent_signal", confidence: 0.9 };
    }

    if (deal.stage === "contacted" && daysInactive > 14) {
      return { from: "contacted", to: "negotiation", condition: "follow_up_due", confidence: 0.7 };
    }

    return null;
  }
}