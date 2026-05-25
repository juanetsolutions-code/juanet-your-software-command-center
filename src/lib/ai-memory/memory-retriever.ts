/**
 * Memory Retriever - Context injection for agents.
 */

import { memoryStore } from "./memory-store";
import type { MemoryEntry } from "./memory-types";

export async function retrieveRelevantMemories(
  tenantId: string,
  query: string,
  limit = 5,
): Promise<MemoryEntry[]> {
  const all = (await (memoryStore as any).getRecentForTenant?.(tenantId)) || [];
  // Simple relevance: keyword match (future: embeddings)
  return (all as MemoryEntry[])
    .filter((m: any) => (m.content || "").toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
}
