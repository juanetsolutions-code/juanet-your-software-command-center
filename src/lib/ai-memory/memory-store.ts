/**
 * AI Memory Store - Long-term memory for agents and decisions.
 * Supabase-ready with mock fallback.
 */

import type { MemoryEntry } from './memory-types';

const memoryStore: MemoryEntry[] = []; // In-memory for now

export async function storeMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
  const full: MemoryEntry = {
    ...entry,
    id: `mem_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  memoryStore.push(full);
  // Future: await supabase.from('ai_memory').insert(full);
  return full;
}

export async function getMemoriesByTenant(tenantId: string, limit = 50): Promise<MemoryEntry[]> {
  return memoryStore
    .filter(m => m.tenantId === tenantId)
    .slice(-limit);
}
