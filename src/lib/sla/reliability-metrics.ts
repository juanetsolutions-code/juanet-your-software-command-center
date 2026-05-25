/**
 * Reliability Metrics
 * Calculates reliability scores and trends.
 */

export class ReliabilityMetrics {
  calculateReliability(uptime: number, errorRate: number, latencyP99: number): number {
    return uptime * 0.5 + (1 - errorRate) * 0.3 + Math.max(0, 1 - latencyP99 / 2000) * 0.2;
  }
}

export const reliabilityMetrics = new ReliabilityMetrics();
