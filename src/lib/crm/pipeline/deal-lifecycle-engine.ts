import type { Deal, Lead } from "../core/crm-entities";

export type DealLifecycleEvent = {
  dealId: string;
  fromStage: string;
  toStage: string;
  reason: string;
  triggeredBy: "ai" | "manual" | "system";
  timestamp: string;
};

export type LifecycleRule = {
  name: string;
  condition: (deal: Deal) => boolean;
  action: (deal: Deal) => string;
  priority: number;
};

export class DealLifecycleEngine {
  private rules: LifecycleRule[] = [];

  registerRule(rule: LifecycleRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => a.priority - b.priority);
  }

  async evaluate(deal: Deal): Promise<DealLifecycleEvent | null> {
    for (const rule of this.rules) {
      if (rule.condition(deal)) {
        const newStage = rule.action(deal);
        return {
          dealId: deal.id,
          fromStage: deal.stage,
          toStage: newStage,
          reason: rule.name,
          triggeredBy: "ai",
          timestamp: new Date().toISOString(),
        };
      }
    }
    return null;
  }

  private createDefaultRules(): LifecycleRule[] {
    return [
      {
        name: "advance_qualified",
        condition: (deal) => deal.stage === "qualified" && (deal.probability ?? 0) > 30,
        action: () => "contacted",
        priority: 10,
      },
      {
        name: "advance_to_negotiation",
        condition: (deal) => deal.stage === "contacted" && (deal.probability ?? 0) > 60,
        action: () => "negotiation",
        priority: 20,
      },
      {
        name: "close_won_high_probability",
        condition: (deal) => (deal.probability ?? 0) >= 90,
        action: () => "closed_won",
        priority: 30,
      },
    ];
  }
}