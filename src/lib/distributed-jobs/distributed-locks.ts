/**
 * In-memory distributed lock simulation. Replace with Redis/Postgres advisory
 * locks when distributed infrastructure is available.
 */
interface LockEntry {
  owner: string;
  expiresAt: number;
}

const locks = new Map<string, LockEntry>();

export function acquireLock(key: string, owner: string, ttlMs = 30_000): boolean {
  const now = Date.now();
  const existing = locks.get(key);
  if (existing && existing.expiresAt > now && existing.owner !== owner) return false;
  locks.set(key, { owner, expiresAt: now + ttlMs });
  return true;
}

export function releaseLock(key: string, owner: string): boolean {
  const existing = locks.get(key);
  if (!existing || existing.owner !== owner) return false;
  locks.delete(key);
  return true;
}

export function isLocked(key: string): boolean {
  const e = locks.get(key);
  return !!e && e.expiresAt > Date.now();
}
