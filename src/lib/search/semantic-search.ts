import type { IndexDocument } from "./indexing-engine";

export interface SemanticSearchQuery {
  tenantId: string;
  vector?: number[];
  q?: string;
  limit?: number;
}

export interface SemanticHit {
  doc: IndexDocument;
  similarity: number;
}

/**
 * Placeholder semantic search. Returns empty until a vector backend is wired.
 */
export async function semanticSearch(_q: SemanticSearchQuery): Promise<SemanticHit[]> {
  return [];
}
