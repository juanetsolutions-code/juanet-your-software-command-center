export type CacheHit = {
  key: string;
  hit: boolean;
  durationMs: number;
  timestamp: string;
};

class CachePerformance {
  private hits: CacheHit[] = [];
  private windowMs = 3600000;

  record(key: string, hit: boolean, durationMs: number): void {
    this.hits.push({ key, hit, durationMs, timestamp: new Date().toISOString() });
    this.prune();
  }

  getStats(): {
    hitRate: number;
    avgLatency: number;
    totalHits: number;
    totalMisses: number;
  } {
    if (this.hits.length === 0) {
      return { hitRate: 0, avgLatency: 0, totalHits: 0, totalMisses: 0 };
    }

    const hits = this.hits.filter((h) => h.hit).length;
    const misses = this.hits.length - hits;
    const avgLatency = this.hits.reduce((sum, h) => sum + h.durationMs, 0) / this.hits.length;

    return {
      hitRate: hits / this.hits.length,
      avgLatency,
      totalHits: hits,
      totalMisses: misses,
    };
  }

  getSlowKeys(thresholdMs: number): string[] {
    const keyLatencies = new Map<string, number>();
    
    for (const hit of this.hits) {
      const current = keyLatencies.get(hit.key) ?? 0;
      keyLatencies.set(hit.key, Math.max(current, hit.durationMs));
    }

    return Array.from(keyLatencies.entries())
      .filter(([, latency]) => latency > thresholdMs)
      .map(([key]) => key);
  }

  private prune(): void {
    const cutoff = Date.now() - this.windowMs;
    this.hits = this.hits.filter((h) => new Date(h.timestamp).getTime() > cutoff);
  }
}

export const cachePerformance = new CachePerformance();

export function recordCacheHit(key: string, hit: boolean, durationMs: number): void {
  cachePerformance.record(key, hit, durationMs);
}

export function getCacheStats() {
  return cachePerformance.getStats();
}