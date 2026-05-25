/**
 * AI Policy Engine
 * Central engine enforcing all AI governance policies at runtime.
 */

import { aiRiskEvaluation } from "./ai-risk-evaluation";
import { promptGovernance } from "./prompt-governance";

export class AIPolicyEngine {
  evaluateRequest(tenantId: string, action: string, prompt?: string): any {
    const risk = aiRiskEvaluation.evaluate(tenantId, action, {});
    const promptCheck = prompt ? promptGovernance.validate(tenantId, prompt) : { approved: true };

    return {
      allowed: risk.recommendedDecision !== "block" && promptCheck.approved,
      risk,
      promptCheck,
    };
  }
}

export const aiPolicyEngine = new AIPolicyEngine();
