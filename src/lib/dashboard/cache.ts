/**
 * Lightweight in-memory TTL cache for repository reads.
 * Prevents excessive Supabase calls for dashboard data that doesn't change often.
 * Not persisted, resets on page reload / HMR.
 */
import { logger } from "@/lib/utils/logger";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();
const MAX_CACHE_SIZE = 500; // LRU limit

export function get<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export function set<T>(key: string, value: T, ttlMs = 60_000): void {
  // LRU eviction
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }

  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function invalidate(keyOrPrefix: string): void {
  if (keyOrPrefix.includes("*")) {
    const prefix = keyOrPrefix.replace("*", "");
    for (const k of cache.keys()) {
      if (k.startsWith(prefix)) cache.delete(k);
    }
  } else {
    cache.delete(keyOrPrefix);
  }
}

export function invalidateByPrefix(prefix: string): void {
  for (const k of Array.from(cache.keys())) {
    if (k.startsWith(prefix)) cache.delete(k);
  }
}

export function invalidateUserScope(userId: string): void {
  // Invalidate common repo caches scoped to a user
  invalidateByPrefix(`repo:projects:`);
  invalidateByPrefix(`repo:requests:`);
  invalidateByPrefix(`repo:messages:`);
  invalidateByPrefix(`repo:invoices:`);
  invalidateByPrefix(`repo:payments:`);
  invalidateByPrefix(`repo:profile:${userId}`);
}

export function afterMutation(table: string, userId?: string): void {
  // Automatic optimistic invalidation after any mutation
  const prefix = `repo:${table}`;
  invalidateByPrefix(prefix);
  if (userId) {
    invalidateUserScope(userId);
  }
  logger.info(`[Cache] invalidated after mutation on ${table}`);
}

export function clearAll(): void {
  cache.clear();
}

/** TTL Tiers (in milliseconds) */
export const TTL = {
  SHORT: 15_000, // 15 seconds — frequently changing data
  MEDIUM: 60_000, // 1 minute — normal dashboard data
  LONG: 5 * 60_000, // 5 minutes — relatively static data
  VERY_LONG: 15 * 60_000, // 15 minutes — almost static
};

/** Creates a tenant-scoped cache key */
export function tenantKey(tenantId: string | null, key: string): string {
  return tenantId ? `tenant:${tenantId}:${key}` : key;
}
