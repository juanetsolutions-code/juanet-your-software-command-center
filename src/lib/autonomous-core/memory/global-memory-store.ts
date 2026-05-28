export type GlobalMemoryEntry = {
  id: string;
  tenantId: string;
  type: "decision" | "outcome" | "pattern" | "preference";
  key: string;
  value: unknown;
  timestamp: string;
  expiresAt?: string;
};

export class GlobalMemoryStore {
  private store: Map<string, GlobalMemoryEntry[]> = new Map();

  set(entry: GlobalMemoryEntry): void {
    const key = `${entry.tenantId}:${entry.type}:${entry.key}`;
    const existing = this.store.get(key) ?? [];
    
    existing.push(entry);
    this.store.set(key, existing.slice(-100));
  }

  get(tenantId: string, type: string, key: string): GlobalMemoryEntry[] {
    const fullKey = `${tenantId}:${type}:${key}`;
    return this.store.get(fullKey) ?? [];
  }

  getLatest(tenantId: string, type: string, key: string): GlobalMemoryEntry | undefined {
    const entries = this.get(tenantId, type, key);
    return entries[entries.length - 1];
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entries] of this.store.entries()) {
      const filtered = entries.filter((e) => !e.expiresAt || e.expiresAt > new Date(now).toISOString());
      if (filtered.length === 0) {
        this.store.delete(key);
      } else {
        this.store.set(key, filtered);
      }
    }
  }
}