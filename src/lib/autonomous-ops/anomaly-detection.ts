/**
 * Anomaly Detection Engine
 * Identifies abnormal platform behavior using statistical and pattern-based methods.
 * Feeds into operational intelligence and predictive alerting.
 */

export interface Anomaly {
  id: string;
  tenantId: string;
  metric: string;
  observedValue: number;
  expectedRange: [number, number];
  severity: number; // 0-1
  description: string;
  confidence: number;
  timestamp: string;
  context: Record<string, any>;
}

export class AnomalyDetection {
  detectAnomalies(
    tenantId: string,
    metrics: Record<string, number>,
    baseline: Record<string, { mean: number; stddev: number }>,
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];

    for (const [key, value] of Object.entries(metrics)) {
      const base = baseline[key];
      if (!base) continue;

      const zScore = Math.abs((value - base.mean) / (base.stddev || 1));
      if (zScore > 3) {
        const severity = Math.min(0.95, zScore / 6);
        anomalies.push({
          id: `anom-${Date.now()}-${key}`,
          tenantId,
          metric: key,
          observedValue: value,
          expectedRange: [base.mean - 2 * base.stddev, base.mean + 2 * base.stddev],
          severity,
          description: `${key} deviated ${zScore.toFixed(1)}σ from baseline`,
          confidence: Math.min(0.92, 0.7 + severity * 0.25),
          timestamp: new Date().toISOString(),
          context: { zScore },
        });
      }
    }

    return anomalies;
  }
}

export const anomalyDetection = new AnomalyDetection();
