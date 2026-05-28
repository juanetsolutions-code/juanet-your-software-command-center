import type { LatencyRecord } from "./latency-analyzer";

export type Bottleneck = {
  resource: string;
  type: "cpu" | "memory" | "io" | "network";
  severity: "low" | "medium" | "high" | "critical";
  durationMs: number;
  timestamp: string;
  samples: number;
};

class BottleneckDetector {
  private latencies: LatencyRecord[] = [];
  private bottlenecks: Bottleneck[] = [];
  private windowMs = 300000;

  record(name: string, durationMs: number, success = true, tenantId?: string): void {
    this.latencies.push({
      operation: name,
      durationMs,
      success,
      timestamp: new Date().toISOString(),
      tenantId,
    });
    this.prune();
  }

  detect(thresholdMs = 1000): Bottleneck[] {
    const resourceStats = new Map<string, { durations: number[]; count: number }>();

    for (const record of this.latencies) {
      if (!resourceStats.has(record.operation)) {
        resourceStats.set(record.operation, { durations: [], count: 0 });
      }
      const stats = resourceStats.get(record.operation)!;
      stats.durations.push(record.durationMs);
      stats.count++;
    }

    const detected: Bottleneck[] = [];

    for (const [resource, stats] of resourceStats) {
      const avg = stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length;
      if (avg > thresholdMs) {
        detected.push({
          resource,
          type: this.inferType(resource),
          severity: avg > thresholdMs * 4 ? "critical" : avg > thresholdMs * 2 ? "high" : "medium",
          durationMs: Math.round(avg),
          timestamp: new Date().toISOString(),
          samples: stats.count,
        });
      }
    }

    this.bottlenecks = detected;
    return detected;
  }

  private inferType(resource: string): "cpu" | "memory" | "io" | "network" {
    if (resource.includes("db") || resource.includes("cache")) return "io";
    if (resource.includes("fetch") || resource.includes("request")) return "network";
    if (resource.includes("stream") || resource.includes("file")) return "io";
    return "cpu";
  }

  private prune(): void {
    const cutoff = Date.now() - this.windowMs;
    this.latencies = this.latencies.filter((l) => new Date(l.timestamp).getTime() > cutoff);
  }
}

export const bottleneckDetector = new BottleneckDetector();

export function recordLatencyData(name: string, durationMs: number, success?: boolean, tenantId?: string): void {
  bottleneckDetector.record(name, durationMs, success, tenantId);
}

export function detectBottlenecks(thresholdMs?: number): Bottleneck[] {
  return bottleneckDetector.detect(thresholdMs);
}