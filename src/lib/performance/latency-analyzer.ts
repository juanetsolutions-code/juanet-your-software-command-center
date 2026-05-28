export type PerformanceMetric = {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
};

export type LatencyRecord = {
  operation: string;
  durationMs: number;
  success: boolean;
  timestamp: string;
  tenantId?: string;
};

class LatencyAnalyzer {
  private records: LatencyRecord[] = [];
  private windowSizeMs = 3600000;

  record(operation: string, durationMs: number, success = true, tenantId?: string): void {
    this.records.push({
      operation,
      durationMs,
      success,
      timestamp: new Date().toISOString(),
      tenantId,
    });
    this.pruneRecords();
  }

  getLatency(operation: string, tenantId?: string): {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    avg: number;
    count: number;
  } | undefined {
    const records = this.records.filter((r) => r.operation === operation && (!tenantId || r.tenantId === tenantId));
    if (records.length === 0) return undefined;

    const sorted = [...records].sort((a, b) => a.durationMs - b.durationMs);
    const values = sorted.map((r) => r.durationMs);

    return {
      p50: percentile(values, 50),
      p90: percentile(values, 90),
      p95: percentile(values, 95),
      p99: percentile(values, 99),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    };
  }

  getDegradedOperations(thresholdMs: number): string[] {
    const operationAvgs = new Map<string, number>();
    
    for (const record of this.records) {
      const current = operationAvgs.get(record.operation) ?? 0;
      operationAvgs.set(record.operation, current + record.durationMs);
    }

    const degraded: string[] = [];
    for (const [op, total] of operationAvgs) {
      const count = this.records.filter((r) => r.operation === op).length;
      if (total / count > thresholdMs) {
        degraded.push(op);
      }
    }

    return degraded;
  }

  private pruneRecords(): void {
    const cutoff = Date.now() - this.windowSizeMs;
    this.records = this.records.filter((r) => new Date(r.timestamp).getTime() > cutoff);
  }
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const index = Math.ceil((p / 100) * values.length) - 1;
  return values[Math.max(0, Math.min(index, values.length - 1))];
}

export const latencyAnalyzer = new LatencyAnalyzer();

export function recordLatency(
  operation: string,
  durationMs: number,
  success?: boolean,
  tenantId?: string
): void {
  latencyAnalyzer.record(operation, durationMs, success, tenantId);
}

export function getOperationLatency(operation: string, tenantId?: string) {
  return latencyAnalyzer.getLatency(operation, tenantId);
}