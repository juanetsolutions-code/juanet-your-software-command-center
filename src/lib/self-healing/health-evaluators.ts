/**
 * Health Evaluators
 * Multi-dimensional health assessment for services, tenants, and platform layers.
 */

export interface HealthEvaluation {
  service: string;
  tenantId: string;
  score: number; // 0 healthy - 1 critical
  degradationType: string;
  indicators: Array<{
    name: string;
    value: number;
    threshold: number;
    status: "ok" | "warn" | "critical";
  }>;
  timestamp: string;
}

export class HealthEvaluators {
  evaluateServiceHealth(
    tenantId: string,
    service: string,
    metrics: Record<string, number>,
  ): HealthEvaluation {
    const indicators = Object.entries(metrics).map(([name, value]) => {
      const threshold = name.includes("error") ? 0.02 : name.includes("latency") ? 300 : 0.8;
      let status: "ok" | "warn" | "critical" = "ok";
      if (value > threshold * 2) status = "critical";
      else if (value > threshold) status = "warn";

      return { name, value, threshold, status };
    });

    const score = Math.min(
      1,
      indicators.reduce(
        (s, i) => s + (i.status === "critical" ? 0.4 : i.status === "warn" ? 0.15 : 0),
        0,
      ),
    );

    return {
      service,
      tenantId,
      score,
      degradationType: score > 0.6 ? "severe" : score > 0.3 ? "moderate" : "none",
      indicators,
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthEvaluators = new HealthEvaluators();
