/**
 * Knowledge Retrieval
 * High-level retrieval optimized for AI copilots and knowledge intelligence systems.
 */

import { hybridSearch } from "./hybrid-search";

export interface KnowledgeRetrievalResult {
  id: string;
  relevance: number;
  source: string;
  content: string;
}

export class KnowledgeRetrieval {
  retrieveForAI(query: string, tenantId: string, maxResults = 10): KnowledgeRetrievalResult[] {
    const base = hybridSearch.search(query, tenantId);
    return base.slice(0, maxResults).map((r) => ({
      id: r.id,
      relevance: r.score,
      source: r.type,
      content: r.content,
    }));
  }
}

export const knowledgeRetrieval = new KnowledgeRetrieval();
