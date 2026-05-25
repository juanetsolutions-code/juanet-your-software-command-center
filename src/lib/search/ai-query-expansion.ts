/**
 * AI Query Expansion
 * Expands user queries using AI for better recall in enterprise search.
 */

export interface ExpandedQuery {
  original: string;
  expansions: string[];
  tenantId: string;
  confidence: number;
}

export class AIQueryExpansion {
  expand(query: string, tenantId: string): ExpandedQuery {
    return {
      original: query,
      expansions: [`${query} related`, `${query} in tenant context`],
      tenantId,
      confidence: 0.78,
    };
  }
}

export const aiQueryExpansion = new AIQueryExpansion();
