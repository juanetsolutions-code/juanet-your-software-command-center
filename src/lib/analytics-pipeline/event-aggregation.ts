/**
 * Event Aggregation
 * Aggregates raw events into time-bucketed metrics.
 */

export interface AggregatedMetric {
  tenantId: string;
  metric: string;
  value: number;
  bucket: string;
}

export class EventAggregation {
  aggregate(events: Array<{ tenantId: string; type: string; value: number }>): AggregatedMetric[] {
    const map = new Map<string, number>();
    events.forEach((e) => {
      const key = `${e.tenantId}:${e.type}`;
      map.set(key, (map.get(key) || 0) + e.value);
    });
    return Array.from(map.entries()).map(([k, v]) => ({
      tenantId: k.split(":")[0],
      metric: k.split(":")[1],
      value: v,
      bucket: new Date().toISOString().slice(0, 13),
    }));
  }
}

export const eventAggregation = new EventAggregation();
