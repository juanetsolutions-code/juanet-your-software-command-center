import type { Lead } from "@/lib/crm/core/crm-entities";

export type SalesMemoryEntry = {
  key: string;
  tenantId: string;
  type: "lead_interaction" | "deal_outcome" | "conversion_pattern";
  data: Record<string, unknown>;
  timestamp: string;
  outcome?: "success" | "failure";
};

export class SalesMemory {
  private memory: Map<string, SalesMemoryEntry[]> = new Map();

  store(entry: SalesMemoryEntry): void {
    const key = `${entry.tenantId}:${entry.type}`;
    const existing = this.memory.get(key) ?? [];
    existing.push(entry);
    this.memory.set(key, existing.slice(-100));
  }

  query(tenantId: string, type: string, limit?: number): SalesMemoryEntry[] {
    const key = `${tenantId}:${type}`;
    const entries = this.memory.get(key) ?? [];
    return limit ? entries.slice(-limit) : entries;
  }

  getPatterns(tenantId: string): Record<string, number> {
    const patterns: Record<string, number> = {};
    const outcomes = this.query(tenantId, "deal_outcome");
    
    for (const entry of outcomes) {
      const key = `${entry.data.outcome_type ?? "unknown"}:${entry.outcome}`;
      patterns[key] = (patterns[key] ?? 0) + 1;
    }
    
    return patterns;
  }

  getLeadHistory(tenantId: string, leadId: string): SalesMemoryEntry[] {
    const interactions = this.query(tenantId, "lead_interaction");
    return interactions.filter((i) => (i.data.leadId as string) === leadId);
  }

  clearTenant(tenantId: string): void {
    Array.from(this.memory.keys())
      .filter((key) => key.startsWith(tenantId))
      .forEach((key) => this.memory.delete(key));
  }
}

export const salesMemoryStore = new SalesMemory();