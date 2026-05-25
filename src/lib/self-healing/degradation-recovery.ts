/**
 * Degradation Recovery
 * Specialized recovery paths for gradual vs sudden degradation.
 * Supports graceful and predictive recovery preparation.
 */

import type { HealthEvaluation } from "./health-evaluators";
import type { RecoveryStrategy } from "./recovery-strategies";

export interface DegradationProfile {
  type: "gradual" | "sudden" | "cascading";
  trend: number; // positive = worsening
  timeToCritical: string;
}

export class DegradationRecovery {
  classifyDegradation(evaluation: HealthEvaluation, previousScore?: number): DegradationProfile {
    const trend = previousScore !== undefined ? evaluation.score - previousScore : 0;

    let type: "gradual" | "sudden" | "cascading" = "gradual";
    if (trend > 0.4) type = "sudden";
    else if (evaluation.score > 0.7 && trend > 0.2) type = "cascading";

    const timeToCritical = evaluation.score > 0.7 ? "5-12m" : "20-45m";

    return { type, trend, timeToCritical };
  }

  selectRecoveryPath(
    profile: DegradationProfile,
    baseStrategies: RecoveryStrategy[],
  ): RecoveryStrategy[] {
    if (profile.type === "sudden") {
      return baseStrategies.filter((s) => s.riskLevel !== "high");
    }
    return baseStrategies;
  }
}

export const degradationRecovery = new DegradationRecovery();
