import type { AgentTask } from "../agent-swarm/agent-types";

export type DecisionContext = {
  tenantId: string;
  autonomyLevel: "off" | "assist" | "semi_auto" | "auto";
  riskTolerance: "low" | "medium" | "high";
  actionHistory: AgentTask[];
};

export class AutonomousDecider {
  decide(action: AgentTask, context: DecisionContext): { shouldAct: boolean; requiresApproval: boolean } {
    if (context.autonomyLevel === "off") {
      return { shouldAct: false, requiresApproval: false };
    }

    const requiresApproval = this.needsApproval(action, context);
    
    if (context.autonomyLevel === "assist") {
      return { shouldAct: false, requiresApproval: false };
    }

    return {
      shouldAct: true,
      requiresApproval: context.autonomyLevel === "semi_auto" ? requiresApproval : false,
    };
  }

  private needsApproval(action: AgentTask, context: DecisionContext): boolean {
    const highRiskTypes = ["send_reminder", "update_stage", "assign_lead"];
    const requires = highRiskTypes.includes(action.type);
    
    return requires && context.riskTolerance !== "high";
  }

  prioritize(actions: AgentTask[]): AgentTask[] {
    return actions.sort((a, b) => b.priority - a.priority);
  }
}