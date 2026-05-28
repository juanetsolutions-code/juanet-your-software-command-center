import type { AgentAction } from "../sales-agent-orchestrator";
import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";

export type ValidationResult = {
  valid: boolean;
  reason?: string;
};

export class ActionValidator {
  validate(action: AgentAction, context: { tenantId: string; userRole?: string }): ValidationResult {
    if (action.type === "update_stage" && context.userRole !== "admin" && context.userRole !== "superadmin") {
      if (context.userRole !== "client") {
        return { valid: false, reason: "Deal stage change requires admin role" };
      }
    }
    
    if (action.type === "assign_lead" && !context.userRole) {
      return { valid: false, reason: "Assign action requires authenticated user" };
    }
    
    return { valid: true };
  }

  isSafeAction(action: AgentAction): boolean {
    return !["update_stage", "send_reminder", "assign_lead"].includes(action.type);
  }
}

export const actionValidator = new ActionValidator();