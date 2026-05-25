/**
 * Copilot Guardrails
 * Enterprise guardrails for safe AI copilot behavior and action gating.
 */

export interface GuardrailResult {
  passed: boolean;
  violations: string[];
  recommendedAction: "allow" | "require_approval" | "block";
}

export class CopilotGuardrails {
  evaluate(actionType: string, riskScore: number, context: any): GuardrailResult {
    const violations: string[] = [];
    let recommended: GuardrailResult["recommendedAction"] = "allow";

    if (riskScore > 0.8) {
      violations.push("high_risk_action");
      recommended = "require_approval";
    }
    if (context?.riskLevel === "high" && riskScore > 0.5) {
      violations.push("tenant_high_risk_context");
      recommended = "block";
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendedAction: recommended,
    };
  }
}

export const copilotGuardrails = new CopilotGuardrails();
