/**
 * AI Memory Infrastructure - Memory Retrieval
 * High-level retrieval facade with context assembly and ranking.
 */

import type { MemoryQuery, MemoryResult } from "./memory-types";
import { memoryIndexing } from "./memory-indexing";
import { memoryStore } from "./memory-store";
import { tenantMemory } from "./tenant-memory";

export class MemoryRetrieval {
  async retrieve(query: MemoryQuery, tenantId: string): Promise<MemoryResult[]> {
    const scopedIds = await tenantMemory.getForTenant(tenantId);
    const entries = await memoryIndexing.search(query, scopedIds);

    // Future: add semantic similarity, recency boost, compression-aware ranking
    return entries.map((entry) => ({
      entry,
      relevance: 0.8, // placeholder
      source: "memory-index",
    }));
  }

  async getContext(tenantId: string, limit = 5): Promise<MemoryResult[]> {
    const recent = await memoryStore.getRecentForTenant(tenantId, limit);
    return recent.map((entry) => ({
      entry,
      relevance: 1.0,
      source: "recent-context",
    }));
  }
}

export const memoryRetrieval = new MemoryRetrieval();
