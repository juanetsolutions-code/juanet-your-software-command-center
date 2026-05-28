import type { HealthSnapshot } from "./system-health";

export type MetricData = {
  name: string;
  value: number;
  timestamp: string;
};

export type AnomalyScore = {
  score: number;
  level: "normal" | "suspicious" | "anomalous";
  factors: string[];
};

export type PerformanceBaseline = {
  metric: string;
  mean: number;
  stdDev: number;
  samples: number;
};

class AnomalyDetector {
  private metrics: Map<string, MetricData[]> = new Map();
  private baselines: Map<string, PerformanceBaseline> = new Map();
  private windowSize = 100;

  recordMetric(name: string, value: number, timestamp?: string): void {
    const data: MetricData = {
      value,
      timestamp: timestamp ?? new Date().toISOString(),
    };

    const history = this.metrics.get(name) ?? [];
    history.push(data);

    if (history.length > this.windowSize) {
      history.shift();
    }

    this.metrics.set(name, history);
  }

  detectAnomalies(healthHistory: HealthSnapshot[]): AnomalyScore[] {
    const scores: AnomalyScore[] = [];

    const healthScores = healthHistory.map((h) => h.score);
    if (healthScores.length > 0) {
      const mean = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;
      const variance = healthScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / healthScores.length;
      const stdDev = Math.sqrt(variance);

      const lastScore = healthScores[healthScores.length - 1];
      if (stdDev > 0 && Math.abs(lastScore - mean) > 2 * stdDev) {
        scores.push({
          score: lastScore,
          level: lastScore < mean - 2 * stdDev ? "anomalous" : "suspicious",
          factors: ["health-score-deviation"],
        });
      }
    }

    return scores;
  }

  getMetricHistory(name: string): MetricData[] {
    return this.metrics.get(name) ?? [];
  }

  calculateBaseline(name: string): PerformanceBaseline | undefined {
    const history = this.metrics.get(name);
    if (!history || history.length === 0) return undefined;

    const values = history.map((m) => m.value);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;

    return {
      metric: name,
      mean,
      stdDev: Math.sqrt(variance),
      samples: values.length,
    };
  }

  updateBaseline(name: string): void {
    const baseline = this.calculateBaseline(name);
    if (baseline) {
      this.baselines.set(name, baseline);
    }
  }

  getBaseline(name: string): PerformanceBaseline | undefined {
    return this.baselines.get(name);
  }

  isAnomalous(name: string, value: number, threshold = 2): boolean {
    const baseline = this.baselines.get(name);
    if (!baseline || baseline.stdDev === 0) return false;
    return Math.abs(value - baseline.mean) > threshold * baseline.stdDev;
  }
}

export const anomalyDetector = new AnomalyDetector();

export function recordMetric(name: string, value: number, timestamp?: string): void {
  anomalyDetector.recordMetric(name, value, timestamp);
}

export function checkAnomaly(name: string, value: number, threshold?: number): boolean {
  return anomalyDetector.isAnomalous(name, value, threshold);
}