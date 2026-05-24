/**
 * Memory Retriever - Context injection for agents.
 */

import { getMemoriesByTenant } from './memory-store';
import type { MemoryEntry } from './memory-types';

export async function retrieveRelevantMemories(
  tenantId: string, 
  query: string, 
  limit = 5
): Promise<MemoryEntry[]> {
  const all = await getMemoriesByTenant(tenantId);
  // Simple relevance: keyword match (future: embeddings)
  return all
    .filter(m => m.content.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
}
