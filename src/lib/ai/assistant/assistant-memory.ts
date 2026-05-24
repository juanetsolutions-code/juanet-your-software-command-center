/**
 * Assistant Memory - Conversation history and state (tenant-isolated).
 */

const memoryStore = new Map<string, any[]>(); // key: tenantId:userId

export function getMemory(tenantId: string, userId?: string): any[] {
  const key = `${tenantId}:${userId || "anon"}`;
  return memoryStore.get(key) || [];
}

export function addToMemory(tenantId: string, userId: string | undefined, message: any) {
  const key = `${tenantId}:${userId || "anon"}`;
  const history = memoryStore.get(key) || [];
  history.push(message);
  // Keep last 50 messages
  if (history.length > 50) history.shift();
  memoryStore.set(key, history);
}

export function clearMemory(tenantId: string, userId?: string) {
  const key = `${tenantId}:${userId || "anon"}`;
  memoryStore.delete(key);
}
