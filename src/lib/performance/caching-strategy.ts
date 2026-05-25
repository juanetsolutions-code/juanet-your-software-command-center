/**
 * Caching Strategy
 * Intelligent multi-level caching with tenant-aware invalidation.
 */

export interface CacheEntry {
  key: string;
  value: any;
  tenantId: string;
  ttl: number;
  createdAt: string;
}

export class CachingStrategy {
  private cache = new Map<string, CacheEntry>();

  set(key: string, value: any, tenantId: string, ttlSeconds = 300): void {
    this.cache.set(`${tenantId}:${key}`, {
      key,
      value,
      tenantId,
      ttl: ttlSeconds,
      createdAt: new Date().toISOString(),
    });
  }

  get(key: string, tenantId: string): any {
    const entry = this.cache.get(`${tenantId}:${key}`);
    if (!entry) return null;
    const age = (Date.now() - new Date(entry.createdAt).getTime()) / 1000;
    if (age > entry.ttl) {
      this.cache.delete(`${tenantId}:${key}`);
      return null;
    }
    return entry.value;
  }
}

export const cachingStrategy = new CachingStrategy();
