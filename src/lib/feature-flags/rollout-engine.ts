/**
 * Rollout Engine - Gradual feature rollout management
 */

import type { FeatureFlag } from "./feature-flags";

export interface RolloutPlan {
  feature: FeatureFlag;
  stages: {
    percentage: number;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  currentStage: number;
}

const rolloutPlans: Map<string, RolloutPlan> = new Map();

export function createRolloutPlan(plan: RolloutPlan): void {
  rolloutPlans.set(plan.feature, plan);
}

export function getRolloutStage(feature: FeatureFlag): number {
  const plan = rolloutPlans.get(feature);
  if (!plan) return 0;

  const now = new Date().toISOString();
  let stage = 0;

  for (let i = plan.stages.length - 1; i >= 0; i--) {
    const s = plan.stages[i];
    if (new Date(s.startDate) <= new Date(now)) {
      if (!s.endDate || new Date(s.endDate) >= new Date(now)) {
        stage = i + 1;
        break;
      }
    }
  }

  return stage;
}

export function getCurrentRolloutPercentage(feature: FeatureFlag): number {
  const plan = rolloutPlans.get(feature);
  if (!plan) return 0;

  const stage = getRolloutStage(feature);
  return plan.stages[stage - 1]?.percentage ?? 0;
}
