/**
 * Realtime Metrics
 * High-frequency, low-latency metric collection for dashboards and alerts.
 */

export interface RealtimeMetric {
  tenantId: string;
  name: string;
  value: number;
  timestamp: string;
}

export class RealtimeMetrics {
  private buffer: RealtimeMetric[] = [];

  ingest(tenantId: string, name: string, value: number): void {
    this.buffer.push({ tenantId, name, value, timestamp: new Date().toISOString() });
    if (this.buffer.length > 5000) this.buffer.shift();
  }

  getRecent(tenantId: string, limit = 50): RealtimeMetric[] {
    return this.buffer.filter((m) => m.tenantId === tenantId).slice(-limit);
  }
}

export const realtimeMetrics = new RealtimeMetrics();
