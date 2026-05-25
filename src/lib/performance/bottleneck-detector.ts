/**
 * Bottleneck Detector
 * Automatically detects performance bottlenecks from profiling data.
 */

export interface Bottleneck {
  name: string;
  averageDuration: number;
  severity: "low" | "medium" | "high";
}

export class BottleneckDetector {
  detect(profiles: Array<{ name: string; durationMs: number }>): Bottleneck[] {
    const grouped: Record<string, number[]> = {};
    profiles.forEach((p) => {
      if (!grouped[p.name]) grouped[p.name] = [];
      grouped[p.name].push(p.durationMs);
    });

    return Object.entries(grouped).map(([name, times]) => {
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const severity = avg > 2000 ? "high" : avg > 500 ? "medium" : "low";
      return { name, averageDuration: avg, severity };
    });
  }
}

export const bottleneckDetector = new BottleneckDetector();
