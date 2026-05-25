/**
 * Health Scoring
 * Calculates composite health scores per subsystem and tenant.
 */

export class HealthScoring {
  calculateScore(metrics: Record<string, number>): number {
    const values = Object.values(metrics);
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}

export const healthScoring = new HealthScoring();
