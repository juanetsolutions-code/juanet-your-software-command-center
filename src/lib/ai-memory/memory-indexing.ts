/**
 * AI Memory Infrastructure - Memory Indexing
 * Semantic and keyword indexing layer for fast retrieval.
 * Designed for future vector embeddings integration.
 */

import type { MemoryEntry, MemoryQuery } from "./memory-types";

export class MemoryIndexing {
  private index: Map<string, MemoryEntry> = new Map();

  async addToIndex(entry: MemoryEntry): Promise<void> {
    // Simple in-memory index for now (future: vector + keyword hybrid)
    this.index.set(entry.id, entry);
  }

  async search(query: MemoryQuery, scopedIds: string[]): Promise<MemoryEntry[]> {
    const results: MemoryEntry[] = [];

    for (const id of scopedIds) {
      const entry = this.index.get(id);
      if (entry && this.matchesQuery(entry, query)) {
        results.push(entry);
      }
    }

    return results;
  }

  private matchesQuery(entry: MemoryEntry, query: MemoryQuery): boolean {
    if (query.type && entry.type !== query.type) return false;
    if (query.tags && !query.tags.some((tag) => entry.tags?.includes(tag))) return false;
    if (query.searchText) {
      const text = JSON.stringify(entry.content).toLowerCase();
      if (!text.includes(query.searchText.toLowerCase())) return false;
    }
    return true;
  }
}

export const memoryIndexing = new MemoryIndexing();
