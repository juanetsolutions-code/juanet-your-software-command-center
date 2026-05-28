import type { AgentAction } from "../sales-agent-orchestrator";

export type SafeguardResult = {
  allowed: boolean;
  reason?: string;
};

export class ActionSafeguards {
  check(action: AgentAction, context: { tenantId: string; autonomyLevel: string }): SafeguardResult {
    if (context.autonomyLevel === "off") {
      return { allowed: false, reason: "Autonomy disabled" };
    }
    
    if (action.confidence < 0.5) {
      return { allowed: false, reason: "Low confidence action blocked" };
    }
    
    if (action.type === "update_stage" && context.autonomyLevel !== "auto") {
      return { allowed: false, reason: "Deal stage changes require auto autonomy" };
    }
    
    return { allowed: true };
  }
}

export const actionSafeguards = new ActionSafeguards();