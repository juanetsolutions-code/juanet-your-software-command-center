/**
 * Long-term Memory
 * Persistent, tenant-scoped long-term memory for AI agents and planning.
 * Part of advanced multi-layer memory architecture.
 */

import type { MemoryEntry } from "./memory-types";

export interface LongTermMemoryRecord extends MemoryEntry {
  retentionPolicy: "permanent" | "policy_governed";
  lastConsolidated: string;
  accessCount: number;
}

export class LongTermMemory {
  private records: LongTermMemoryRecord[] = [];

  store(
    record: Omit<LongTermMemoryRecord, "id" | "timestamp" | "lastConsolidated" | "accessCount">,
  ): LongTermMemoryRecord {
    const full: LongTermMemoryRecord = {
      ...record,
      id: `ltm-${Date.now()}`,
      timestamp: new Date().toISOString(),
      lastConsolidated: new Date().toISOString(),
      accessCount: 0,
    };
    this.records.push(full);
    return full;
  }

  retrieve(tenantId: string, type?: string): LongTermMemoryRecord[] {
    return this.records
      .filter((r) => r.tenantId === tenantId && (!type || r.type === type))
      .map((r) => ({ ...r, accessCount: r.accessCount + 1 }));
  }
}

export const longTermMemory = new LongTermMemory();
