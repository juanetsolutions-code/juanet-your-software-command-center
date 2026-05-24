interface FieldLock {
  resource: string;
  field: string;
  userId: string;
  acquiredAt: number;
  ttlMs: number;
}

const locks = new Map<string, FieldLock>();

function k(resource: string, field: string) {
  return `${resource}:${field}`;
}

export function acquireFieldLock(resource: string, field: string, userId: string, ttlMs = 15_000): boolean {
  const existing = locks.get(k(resource, field));
  const now = Date.now();
  if (existing && existing.userId !== userId && now - existing.acquiredAt < existing.ttlMs) return false;
  locks.set(k(resource, field), { resource, field, userId, acquiredAt: now, ttlMs });
  return true;
}

export function releaseFieldLock(resource: string, field: string, userId: string): boolean {
  const existing = locks.get(k(resource, field));
  if (!existing || existing.userId !== userId) return false;
  locks.delete(k(resource, field));
  return true;
}

export function getResourceLocks(resource: string): FieldLock[] {
  return Array.from(locks.values()).filter((l) => l.resource === resource);
}
