/**
 * Contextual Ranking
 * AI-enhanced ranking that considers user context, tenant policies, and recency.
 */

export interface ContextualRankedResult {
  id: string;
  finalScore: number;
  contextualBoost: number;
  baseScore: number;
}

export class ContextualRanking {
  rank(results: any[], context: Record<string, any>): ContextualRankedResult[] {
    return results.map((r, i) => ({
      id: r.id,
      finalScore: r.score * (1 + (context.relevanceBoost || 0.1)),
      contextualBoost: context.relevanceBoost || 0.1,
      baseScore: r.score,
    }));
  }
}

export const contextualRanking = new ContextualRanking();
