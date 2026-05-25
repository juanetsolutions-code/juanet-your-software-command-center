/**
 * Adaptive Planning
 * Supports dynamic replanning based on new signals during execution.
 */

import type { ExecutionPlan } from "./planning-engine";

export interface AdaptationTrigger {
  type: "metric_change" | "new_risk" | "objective_shift" | "failure";
  severity: number;
  details: Record<string, any>;
}

export class AdaptivePlanning {
  adaptPlan(currentPlan: ExecutionPlan, trigger: AdaptationTrigger): ExecutionPlan {
    const adapted = { ...currentPlan };
    adapted.id = `${currentPlan.id}-adapted-${Date.now()}`;
    adapted.steps = [...currentPlan.steps];

    if (trigger.severity > 0.6) {
      // Insert validation step at front
      adapted.steps.unshift({
        id: "adapt-val",
        description: `Re-validate due to ${trigger.type}`,
        agent: "governor",
        estimatedDuration: "8s",
        dependencies: [],
        risk: 0.05,
      });
      adapted.confidence = Math.max(0.5, adapted.confidence - 0.15);
    }

    adapted.strategy = trigger.severity > 0.5 ? "conservative" : currentPlan.strategy;
    return adapted;
  }
}

export const adaptivePlanning = new AdaptivePlanning();
