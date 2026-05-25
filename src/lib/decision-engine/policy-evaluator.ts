/**
 * AI Decision Engine - Policy Evaluator
 * Evaluates decisions against configurable policies before recommendation.
 */

import type { DecisionPolicy, DecisionInput } from "./decision-history";

export class PolicyEvaluator {
  evaluate(
    input: DecisionInput,
    policies: DecisionPolicy[],
  ): { passed: boolean; violations: string[] } {
    const violations: string[] = [];

    policies.forEach((policy) => {
      // Simple rule evaluation stub
      if (policy.rules.includes("no_high_risk_without_approval") && input.signals?.highRisk) {
        violations.push(policy.name);
      }
    });

    return {
      passed: violations.length === 0,
      violations,
    };
  }
}

export const policyEvaluator = new PolicyEvaluator();
