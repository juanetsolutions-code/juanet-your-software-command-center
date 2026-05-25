/**
 * Copilot Memory
 * Dedicated memory layer for copilot sessions, integrated with ai-memory systems.
 */

import type { CopilotContext } from "./copilot-context";

export interface CopilotMemoryEntry {
  id: string;
  sessionId: string;
  tenantId: string;
  type: "fact" | "decision" | "observation";
  content: string;
  timestamp: string;
}

export class CopilotMemory {
  private memory = new Map<string, CopilotMemoryEntry[]>();

  store(
    sessionId: string,
    tenantId: string,
    entry: Omit<CopilotMemoryEntry, "id" | "timestamp">,
  ): CopilotMemoryEntry {
    const full: CopilotMemoryEntry = {
      ...entry,
      id: `mem-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const existing = this.memory.get(sessionId) || [];
    existing.push(full);
    this.memory.set(sessionId, existing);
    return full;
  }

  retrieve(sessionId: string, tenantId: string): CopilotMemoryEntry[] {
    return this.memory.get(sessionId)?.filter((e) => e.tenantId === tenantId) || [];
  }
}

export const copilotMemory = new CopilotMemory();
