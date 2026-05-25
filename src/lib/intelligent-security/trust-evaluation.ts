/**
 * Trust Evaluation
 * Models dynamic trust scores for users, services, and tenants (analysis/preparation only).
 */

export interface TrustScore {
  subjectId: string;
  tenantId: string;
  score: number; // 0 distrust - 1 full trust
  factors: Record<string, number>;
  lastEvaluated: string;
  trustLevel: "low" | "medium" | "high" | "verified";
}

export class TrustEvaluation {
  evaluate(tenantId: string, subjectId: string, signals: Record<string, number>): TrustScore {
    const score = Math.max(0.1, 1 - Object.values(signals).reduce((s, v) => s + v, 0) / 3);

    let level: TrustScore["trustLevel"] = "medium";
    if (score > 0.85) level = "verified";
    else if (score > 0.65) level = "high";
    else if (score < 0.4) level = "low";

    return {
      subjectId,
      tenantId,
      score,
      factors: signals,
      lastEvaluated: new Date().toISOString(),
      trustLevel: level,
    };
  }
}

export const trustEvaluation = new TrustEvaluation();
