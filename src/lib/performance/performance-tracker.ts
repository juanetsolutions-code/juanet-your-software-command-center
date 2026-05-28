import type { PerformanceMetric } from "./latency-analyzer";

export type PerformanceMarker = {
  name: string;
  startTime: number;
  memoryBefore?: number;
};

class PerformanceTracker {
  private markers: Map<string, PerformanceMarker> = new Map();
  private metrics: PerformanceMetric[] = [];

  mark(name: string): void {
    this.markers.set(name, {
      name,
      startTime: performance.now(),
      memoryBefore: process.memoryUsage().heapUsed,
    });
  }

  measure(name: string, endName?: string): PerformanceMetric | undefined {
    const startMarker = this.markers.get(name);
    const endMarker = endName ? this.markers.get(endName) : undefined;
    
    const endTime = endMarker ? endMarker.startTime : performance.now();
    const duration = endTime - startMarker.startTime;

    const metric: PerformanceMetric = {
      name,
      value: duration,
      timestamp: new Date().toISOString(),
    };

    this.metrics.push(metric);
    this.markers.delete(name);

    return metric;
  }

  getMetrics(name?: string): PerformanceMetric[] {
    return name ? this.metrics.filter((m) => m.name === name) : [...this.metrics];
  }

  clear(): void {
    this.markers.clear();
    this.metrics = [];
  }
}

export const performanceTracker = new PerformanceTracker();

export function performanceMark(name: string): void {
  performanceTracker.mark(name);
}

export function performanceMeasure(name: string, endName?: string): PerformanceMetric | undefined {
  return performanceTracker.measure(name, endName);
}