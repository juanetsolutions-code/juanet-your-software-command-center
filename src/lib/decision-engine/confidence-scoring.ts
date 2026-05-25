/**
 * AI Decision Engine - Confidence Scoring
 * Calculates and normalizes confidence across different decision sources.
 */

export class ConfidenceScoring {
  score(decision: any, factors: Record<string, number>): number {
    const weights = { policy: 0.4, data: 0.3, history: 0.3 };
    let score = 0;
    Object.keys(factors).forEach((key) => {
      score += (factors[key] || 0) * (weights[key as keyof typeof weights] || 0.2);
    });
    return Math.min(Math.max(score, 0), 1);
  }
}

export const confidenceScoring = new ConfidenceScoring();
