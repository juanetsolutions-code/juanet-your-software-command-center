export type CacheEntry<T = unknown> = {
  value: T;
  expiresAt: number;
  createdAt: number;
  tags?: string[];
};

export type CacheStrategy = "memory" | "redis" | "hybrid";

export type CacheOptions = {
  ttlSeconds?: number;
  tags?: string[];
  strategy?: CacheStrategy;
};

class CacheProvider {
  private store: Map<string, CacheEntry> = new Map();
  private strategy: CacheStrategy = "memory";
  private defaultTtlSeconds = 300;
  private maxSize = 10000;

  get<T = unknown>(key: string): T | undefined {
    const entry = this.store.get(key);
    
    if (!entry) return undefined;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  set<T = unknown>(key: string, value: T, options?: CacheOptions): void {
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      const firstKey = Array.from(this.store.keys())[0];
      this.store.delete(firstKey);
    }

    const ttl = options?.ttlSeconds ?? this.defaultTtlSeconds;
    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttl * 1000,
      createdAt: Date.now(),
      tags: options?.tags,
    };

    this.store.set(key, entry);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  invalidateByTag(tag: string): number {
    let count = 0;
    for (const [key, entry] of this.store) {
      if (entry.tags?.includes(tag)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  size(): number {
    return this.store.size;
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }

  getStrategy(): CacheStrategy {
    return this.strategy;
  }

  setStrategy(strategy: CacheStrategy): void {
    this.strategy = strategy;
  }
}

export const cacheProvider = new CacheProvider();

export function getCacheStrategy(): CacheStrategy {
  return cacheProvider.getStrategy();
}

export function setCacheStrategy(strategy: CacheStrategy): void {
  cacheProvider.setStrategy(strategy);
}

const tenantCaches: Map<string, CacheProvider> = new Map();

export function getTenantCache(tenantId: string): CacheProvider {
  if (!tenantCaches.has(tenantId)) {
    const cache = new CacheProvider();
    tenantCaches.set(tenantId, cache);
  }
  return tenantCaches.get(tenantId)!;
}