/**
 * Observability Metrics
 * Provides structured, UI-agnostic metrics for the system.
 * Used by health checks and admin tooling.
 */

export interface Metric {
  name: string;
  value: number | string | boolean;
  unit?: string;
  timestamp: string;
  tags?: Record<string, string>;
}

const metricsStore: Metric[] = [];

export function recordMetric(
  name: string,
  value: number | string | boolean,
  unit?: string,
  tags?: Record<string, string>,
): void {
  const metric: Metric = {
    name,
    value,
    unit,
    timestamp: new Date().toISOString(),
    tags,
  };
  metricsStore.push(metric);

  // Keep only last 500 metrics in memory
  if (metricsStore.length > 500) {
    metricsStore.shift();
  }
}

export function getMetrics(limit = 100): Metric[] {
  return metricsStore.slice(-limit);
}

export function getMetricSummary() {
  const summary: Record<string, { count: number; lastValue: any }> = {};

  for (const m of metricsStore) {
    if (!summary[m.name]) {
      summary[m.name] = { count: 0, lastValue: m.value };
    }
    summary[m.name].count++;
    summary[m.name].lastValue = m.value;
  }

  return summary;
}

export function clearMetrics(): void {
  metricsStore.length = 0;
}
