import type { AgentTask } from "../agent-swarm/agent-types";

export type RiskAssessment = {
  level: "low" | "medium" | "high";
  factors: string[];
  actionAllowed: boolean;
};

export class RiskEvaluator {
  evaluate(task: AgentTask, tenantPolicies?: Record<string, unknown>): RiskAssessment {
    const factors: string[] = [];
    let riskScore = 0;

    const volumeLimits = tenantPolicies?.dailyActionLimit as number ?? 100;
    const timeOfDay = new Date().getHours();
    
    if (timeOfDay >= 22 || timeOfDay <= 6) {
      factors.push("off_hours");
      riskScore += 20;
    }

    if (task.priority === "urgent" && timeOfDay < 9) {
      factors.push("urgent_early_morning");
      riskScore += 10;
    }

    const riskTypes = ["send_reminder", "assign_lead", "update_stage"];
    if (riskTypes.includes(task.type)) {
      factors.push("high_risk_action");
      riskScore += 15;
    }

    let level: "low" | "medium" | "high" = "low";
    if (riskScore > 30) level = "high";
    else if (riskScore > 15) level = "medium";

    return {
      level,
      factors,
      actionAllowed: riskScore <= 50,
    };
  }
}