/**
 * Health Score
 * Calculates tenant health based on activity and adoption.
 */

export function calculateHealthScore(
  tenantId: string,
  metrics: {
    activeUsers: number;
    featureAdoption: number;
    supportTickets: number;
    lastLoginDays: number;
  },
): number {
  let score = 100;

  score -= Math.min(metrics.supportTickets * 5, 30);
  score -= Math.min(metrics.lastLoginDays * 2, 20);
  score += Math.min(metrics.featureAdoption, 30);
  score += Math.min(metrics.activeUsers * 2, 20);

  return Math.max(0, Math.min(100, Math.round(score)));
}
