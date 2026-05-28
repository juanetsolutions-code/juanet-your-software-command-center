import type { BaseAgent, AgentType, AgentInfo, AgentTask } from "./agent-types";
import { emitEvent } from "@/lib/event-bus";

export class AgentRegistry {
  private agents: Map<string, BaseAgent & { tenantId?: string }> = new Map();
  private tenantAgents: Map<string, Set<string>> = new Map();

  register(agent: BaseAgent, tenantId?: string): void {
    this.agents.set(agent.id, { ...agent, tenantId });
    
    if (tenantId) {
      const tenantSet = this.tenantAgents.get(tenantId) ?? new Set();
      tenantSet.add(agent.id);
      this.tenantAgents.set(tenantId, tenantSet);
    }
    
    emitEvent({
      id: `evt_${Date.now()}`,
      type: "agent.registered",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { agentId: agent.id, agentType: (agent as any).type },
      version: "1.0",
    });
  }

  unregister(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    
    this.agents.delete(agentId);
    
    if (agent.tenantId) {
      const tenantSet = this.tenantAgents.get(agent.tenantId);
      tenantSet?.delete(agentId);
    }
    
    return true;
  }

  get(agentId: string): BaseAgent | undefined {
    return this.agents.get(agentId);
  }

  getByTenant(tenantId: string): BaseAgent[] {
    const agentIds = this.tenantAgents.get(tenantId) ?? new Set();
    return Array.from(agentIds)
      .map((id) => this.agents.get(id))
      .filter((agent): agent is BaseAgent => !!agent);
  }

  getByType(type: AgentType, tenantId?: string): BaseAgent[] {
    return Array.from(this.agents.values()).filter((agent) => {
      const matchesType = (agent as any).type === type;
      const matchesTenant = tenantId ? agent.tenantId === tenantId : !agent.tenantId;
      return matchesType && matchesTenant;
    });
  }

  list(): AgentInfo[] {
    return Array.from(this.agents.entries()).map(([id, agent]) => ({
      id,
      type: (agent as any).type,
      tenantId: agent.tenantId ?? "system",
      status: agent.status,
      capabilities: agent.capabilities,
      lastHeartbeat: new Date().toISOString(),
      processedTasks: 0,
    }));
  }

  shutdownTenant(tenantId: string): void {
    const agents = this.getByTenant(tenantId);
    for (const agent of agents) {
      if (agent.shutdown) {
        agent.shutdown().catch(console.error);
      }
    }
    this.tenantAgents.delete(tenantId);
  }
}

export const agentRegistry = new AgentRegistry();