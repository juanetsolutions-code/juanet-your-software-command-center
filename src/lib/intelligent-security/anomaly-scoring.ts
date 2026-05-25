/**
 * Anomaly Scoring
 * Computes risk scores from behavioral and operational anomalies for security analysis.
 */

export interface AnomalyScore {
  subjectId: string;
  tenantId: string;
  score: number; // 0-1
  factors: Array<{ factor: string; contribution: number }>;
  classification: "benign" | "suspicious" | "high_risk";
  timestamp: string;
}

export class AnomalyScoring {
  scoreAnomaly(tenantId: string, subjectId: string, signals: Record<string, number>): AnomalyScore {
    const score =
      Object.values(signals).reduce((s, v) => s + v, 0) / Math.max(1, Object.keys(signals).length);
    const normalized = Math.min(0.98, score);

    return {
      subjectId,
      tenantId,
      score: normalized,
      factors: Object.entries(signals).map(([f, c]) => ({ factor: f, contribution: c })),
      classification: normalized > 0.75 ? "high_risk" : normalized > 0.4 ? "suspicious" : "benign",
      timestamp: new Date().toISOString(),
    };
  }
}

export const anomalyScoring = new AnomalyScoring();
