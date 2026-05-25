/**
 * Memory Retention
 * Policies and mechanisms for what to keep, consolidate, or forget over time.
 */

export interface RetentionPolicy {
  type: "episodic" | "semantic" | "contextual" | "longterm";
  maxAgeDays: number;
  minImportance: number;
  consolidationIntervalHours: number;
}

export class MemoryRetention {
  private policies: RetentionPolicy[] = [
    { type: "episodic", maxAgeDays: 90, minImportance: 0.3, consolidationIntervalHours: 24 },
    { type: "semantic", maxAgeDays: 365, minImportance: 0.1, consolidationIntervalHours: 168 },
    { type: "contextual", maxAgeDays: 7, minImportance: 0.05, consolidationIntervalHours: 6 },
    { type: "longterm", maxAgeDays: 1825, minImportance: 0.4, consolidationIntervalHours: 720 },
  ];

  shouldRetain(entryType: RetentionPolicy["type"], ageDays: number, importance: number): boolean {
    const p = this.policies.find((pp) => pp.type === entryType)!;
    return ageDays < p.maxAgeDays && importance >= p.minImportance;
  }
}

export const memoryRetention = new MemoryRetention();
