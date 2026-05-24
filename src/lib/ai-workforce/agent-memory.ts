/**
 * Shared, tenant-scoped working memory for AI workforce agents.
 * In-memory implementation; swap to Supabase/Redis when wiring real backend.
 */
interface MemoryEntry {
  key: string;
  value: unknown;
  tenantId: string;
  agentId?: string;
  expiresAt?: number;
}

const store = new Map<string, MemoryEntry>();

function k(tenantId: string, key: string, agentId?: string) {
  return `${tenantId}::${agentId ?? "*"}::${key}`;
}

export function setMemory(entry: MemoryEntry) {
  store.set(k(entry.tenantId, entry.key, entry.agentId), entry);
}

export function getMemory(tenantId: string, key: string, agentId?: string) {
  const e = store.get(k(tenantId, key, agentId));
  if (!e) return null;
  if (e.expiresAt && e.expiresAt < Date.now()) {
    store.delete(k(tenantId, key, agentId));
    return null;
  }
  return e.value;
}

export function clearTenantMemory(tenantId: string) {
  for (const key of store.keys()) {
    if (key.startsWith(`${tenantId}::`)) store.delete(key);
  }
}
