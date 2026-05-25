/**
 * AI Memory Store - Long-term memory for agents and decisions.
 * Supabase-ready with mock fallback.
 */

import type { MemoryEntry } from "./memory-types";

const store: MemoryEntry[] = []; // In-memory for now (future Supabase)

export class MemoryStore {
  async save(entry: MemoryEntry): Promise<void> {
    store.push(entry);
  }

  async getRecentForTenant(tenantId: string, limit = 20): Promise<MemoryEntry[]> {
    return store.filter((m) => m.tenantId === tenantId).slice(-limit);
  }
}

export const memoryStore = new MemoryStore();
