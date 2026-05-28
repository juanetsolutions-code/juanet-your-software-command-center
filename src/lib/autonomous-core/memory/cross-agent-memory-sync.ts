import type { GlobalMemoryEntry, GlobalMemoryStore } from "./global-memory-store";
import { agentRegistry } from "@/lib/agent-swarm/agent-registry";

export class CrossAgentMemorySync {
  private memory = new GlobalMemoryStore();

  sync(tenantId: string): void {
    const agents = agentRegistry.getByTenant(tenantId);
    
    for (const agent of agents) {
      const agentMemory = (agent as any).memory;
      if (agentMemory) {
        this.mirrorAgentMemory(tenantId, agent.id, agentMemory);
      }
    }
  }

  private mirrorAgentMemory(tenantId: string, agentId: string, agentMemory: any): void {
    for (const [key, value] of Object.entries(agentMemory)) {
      this.memory.set({
        id: `mem_${Date.now()}`,
        tenantId,
        type: "pattern",
        key: `${agentId}:${key}`,
        value,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getContext(tenantId: string): Record<string, unknown> {
    const context: Record<string, unknown> = {};
    const decisions = this.memory.get(tenantId, "decision", "*");
    
    for (const entry of decisions) {
      context[entry.key] = entry.value;
    }

    return context;
  }
}