import type { Deal } from "../core/crm-entities";

export type ProgressionRule = {
  id: string;
  name: string;
  trigger: string;
  condition: (deal: Deal) => boolean;
  action: string;
  priority: number;
};

export class DealProgressionRules {
  private rules: ProgressionRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: "high_engagement_advance",
        name: "High Engagement Advance",
        trigger: "signal_detected",
        condition: (deal) => (deal.probability ?? 0) > 70 && deal.stage === "qualified",
        action: "advance_to_contacted",
        priority: 10,
      },
      {
        id: "stalled_deal_regression",
        name: "Stalled Deal Regression",
        trigger: "inactivity_detected",
        condition: (deal) => {
          if (!deal.updatedAt) return false;
          const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
          return days > 30 && deal.stage === "negotiation";
        },
        action: "regress_to_contacted",
        priority: 20,
      },
      {
        id: "ready_to_close",
        name: "Ready to Close",
        trigger: "high_probability",
        condition: (deal) => (deal.probability ?? 0) >= 90 && deal.stage === "negotiation",
        action: "suggest_close",
        priority: 30,
      },
    ];
  }

  evaluate(deal: Deal): ProgressionRule[] {
    return this.rules.filter((rule) => rule.condition(deal));
  }

  overrideRule(id: string, rule: ProgressionRule): void {
    const index = this.rules.findIndex((r) => r.id === id);
    if (index >= 0) {
      this.rules[index] = rule;
    }
  }
}