import type { GlobalMemoryEntry } from "./global-memory-store";

export class TenantIntelligenceMemory {
  private patterns: Map<string, GlobalMemoryEntry[]> = new Map();

  recordSuccess(tenantId: string, pattern: string, outcome: Record<string, unknown>): void {
    const entry: GlobalMemoryEntry = {
      id: `mem_${Date.now()}`,
      tenantId,
      type: "outcome",
      key: pattern,
      value: outcome,
      timestamp: new Date().toISOString(),
    };

    const existing = this.patterns.get(tenantId) ?? [];
    existing.push(entry);
    this.patterns.set(tenantId, existing.slice(-50));
  }

  getSuccessRate(tenantId: string, pattern: string): number {
    const entries = this.patterns.get(tenantId) ?? [];
    const patternEntries = entries.filter((e) => e.key === pattern);
    
    if (patternEntries.length === 0) return 0;

    const successes = patternEntries.filter((e) => (e.value as any)?.success === true).length;
    return successes / patternEntries.length;
  }

  getBestPatterns(tenantId: string, limit: number = 5): string[] {
    const entries = this.patterns.get(tenantId) ?? [];
    const patternScores = new Map<string, [number, number]>();

    for (const entry of entries) {
      const existing = patternScores.get(entry.key) ?? [0, 0];
      const isSuccess = (entry.value as any)?.success === true ? 1 : 0;
      patternScores.set(entry.key, [existing[0] + isSuccess, existing[1] + 1]);
    }

    return Array.from(patternScores.entries())
      .map(([pattern, [successes, total]]) => ({ pattern, rate: successes / total }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, limit)
      .map((p) => p.pattern);
  }
}