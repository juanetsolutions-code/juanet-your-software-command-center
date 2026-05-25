/**
 * Risk Correlation
 * Correlates signals across security, ops, and behavioral domains for holistic risk view.
 */

import type { AnomalyScore } from "./anomaly-scoring";

export interface CorrelatedRisk {
  tenantId: string;
  overallRisk: number;
  correlatedSignals: string[];
  crossDomainInsights: string[];
  recommendedAnalysis: string[];
}

export class RiskCorrelation {
  correlate(
    tenantId: string,
    securityScores: AnomalyScore[],
    operationalRisks: Array<{ category: string; score: number }>,
  ): CorrelatedRisk {
    const secAvg =
      securityScores.reduce((s, sc) => s + sc.score, 0) / Math.max(1, securityScores.length);
    const opsAvg =
      operationalRisks.reduce((s, r) => s + r.score, 0) / Math.max(1, operationalRisks.length);
    const overall = Math.min(0.97, secAvg * 0.6 + opsAvg * 0.4);

    return {
      tenantId,
      overallRisk: overall,
      correlatedSignals: [
        ...securityScores.map((s) => s.classification),
        ...operationalRisks.map((r) => r.category),
      ],
      crossDomainInsights: overall > 0.6 ? ["possible_coordinated_threat"] : [],
      recommendedAnalysis: ["review_access_logs", "behavioral_baseline_refresh"],
    };
  }
}

export const riskCorrelation = new RiskCorrelation();
