import type { AgentAction, ActionDecision } from "../sales-agent-orchestrator";
import { actionExecutor } from "./action-executor";
import { actionValidator } from "./action-validator";

export class ActionRouter {
  async route(decision: ActionDecision, context: { tenantId: string; userRole?: string }, userId?: string) {
    const validation = actionValidator.validate(decision.action, context);
    
    if (!validation.valid) {
      return { success: false, skipped: true, reason: validation.reason };
    }
    
    if (decision.action.requiresApproval && !decision.approved) {
      return { success: false, pendingApproval: true };
    }
    
    return actionExecutor.execute(decision.action, context.tenantId, userId);
  }
}

export const actionRouter = new ActionRouter();