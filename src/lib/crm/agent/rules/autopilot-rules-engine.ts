import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";

export type AutopilotRule = {
  id: string;
  tenantId: string;
  name: string;
  trigger: "lead_inactive" | "deal_stuck" | "high_score_lead" | "pipeline_change";
  conditions: Record<string, unknown>;
  actions: Array<{
    type: "create_task" | "send_reminder" | "assign_lead";
    payload: Record<string, unknown>;
  }>;
  enabled: boolean;
};

export class AutopilotRulesEngine {
  private rules: Map<string, AutopilotRule> = new Map();

  register(rule: AutopilotRule): void {
    this.rules.set(rule.id, rule);
  }

  evaluate(lead: Lead): AutopilotRule[] {
    return Array.from(this.rules.values()).filter((rule) => {
      if (!rule.enabled) return false;
      
      switch (rule.trigger) {
        case "high_score_lead":
          return (lead.score ?? 0) >= 80;
        case "lead_inactive":
          return lead.status === "new" && !lead.lastContactedAt;
      }
      
      return false;
    });
  }

  evaluateDeal(deal: Deal): AutopilotRule[] {
    return Array.from(this.rules.values()).filter((rule) => {
      if (!rule.enabled) return false;
      
      switch (rule.trigger) {
        case "deal_stuck":
          if (!deal.updatedAt) return false;
          const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
          return days > 5 && deal.stage !== "closed_won" && deal.stage !== "closed_lost";
      }
      
      return false;
    });
  }
}

export const autopilotRules = new AutopilotRulesEngine();