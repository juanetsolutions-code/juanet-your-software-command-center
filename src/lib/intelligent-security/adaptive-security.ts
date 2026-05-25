/**
 * Adaptive Security
 * Prepares dynamic security posture adjustments based on risk signals (analysis only, no enforcement).
 */

import type { AnomalyScore } from "./anomaly-scoring";

export interface SecurityPostureRecommendation {
  tenantId: string;
  recommendedLevel: "standard" | "elevated" | "strict";
  triggers: string[];
  duration: string;
  rationale: string;
}

export class AdaptiveSecurity {
  recommendPosture(tenantId: string, scores: AnomalyScore[]): SecurityPostureRecommendation {
    const maxScore = Math.max(...scores.map((s) => s.score), 0);
    let level: "standard" | "elevated" | "strict" = "standard";
    if (maxScore > 0.75) level = "strict";
    else if (maxScore > 0.45) level = "elevated";

    return {
      tenantId,
      recommendedLevel: level,
      triggers: scores.filter((s) => s.score > 0.4).map((s) => s.classification),
      duration: level === "strict" ? "4h" : "24h",
      rationale: `Max anomaly ${maxScore.toFixed(2)}`,
    };
  }
}

export const adaptiveSecurity = new AdaptiveSecurity();
