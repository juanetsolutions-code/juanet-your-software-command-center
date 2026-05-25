/**
 * Strategic Metrics
 * Longer-horizon strategic indicators for platform and tenant strategy.
 */

export interface StrategicMetric {
  tenantId: string;
  metric: string;
  current: number;
  target12m: number;
  trajectory: number;
  strategicImportance: number;
}

export class StrategicMetrics {
  project(tenantId: string, current: Record<string, number>): StrategicMetric[] {
    return Object.entries(current).map(([m, v]) => ({
      tenantId,
      metric: m,
      current: v,
      target12m: v * 1.6,
      trajectory: 0.12,
      strategicImportance: m.includes("retention") ? 0.95 : 0.7,
    }));
  }
}

export const strategicMetrics = new StrategicMetrics();
