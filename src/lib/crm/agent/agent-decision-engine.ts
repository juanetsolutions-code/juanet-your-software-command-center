import type { AgentAction } from "./sales-agent-orchestrator";
import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type DecisionContext = {
  tenantId: string;
  entity: Lead | Deal;
  history: unknown[];
  autonomyLevel: "off" | "assist" | "semi_auto" | "auto";
};

export class AgentDecisionEngine {
  shouldAct(context: DecisionContext, action: AgentAction): boolean {
    if (context.autonomyLevel === "off") return false;
    
    if (context.autonomyLevel === "assist") {
      return false;
    }
    
    if (context.autonomyLevel === "semi_auto" && action.requiresApproval) {
      return false;
    }
    
    return true;
  }

  getConfidence(action: AgentAction): "low" | "medium" | "high" {
    if (action.confidence > 0.8) return "high";
    if (action.confidence > 0.5) return "medium";
    return "low";
  }
}

export const agentDecisionEngine = new AgentDecisionEngine();