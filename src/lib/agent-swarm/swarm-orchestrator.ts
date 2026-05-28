import { agentRegistry, type AgentRegistry } from "./agent-registry";
import { taskDistributor } from "./task-distributor";
import type { AgentTask, AgentType } from "./agent-types";

export type SwarmState = {
  activeTenants: Set<string>;
  totalAgents: number;
  pendingTasks: number;
  lastCycle: string;
};

export class SwarmOrchestrator {
  private state: SwarmState = {
    activeTenants: new Set(),
    totalAgents: 0,
    pendingTasks: 0,
    lastCycle: "",
  };

  initializeTenant(tenantId: string): void {
    this.state.activeTenants.add(tenantId);
    this.spawnTenantAgents(tenantId);
  }

  shutdownTenant(tenantId: string): void {
    agentRegistry.shutdownTenant(tenantId);
    this.state.activeTenants.delete(tenantId);
  }

  assignTask(task: AgentTask): string | null {
    this.state.pendingTasks++;
    return taskDistributor.distribute(task);
  }

  getAgentCount(): number {
    return agentRegistry.list().length;
  }

  getTenantStates(): SwarmState {
    return { ...this.state };
  }

  private spawnTenantAgents(tenantId: string): void {
    import("../agents/sales/lead-hunter-agent").then(({ leadHunterAgent }) => {
      agentRegistry.register(leadHunterAgent, tenantId);
    });
    import("../agents/sales/lead-qualifier-agent").then(({ leadQualifierAgent }) => {
      agentRegistry.register(leadQualifierAgent, tenantId);
    });
    import("../agents/sales/outreach-agent").then(({ outreachAgent }) => {
      agentRegistry.register(outreachAgent, tenantId);
    });
  }

  async runTenantCycle(tenantId: string): Promise<{ tasksCompleted: number; tasksCreated: number }> {
    const tasksCompleted = 0;
    const tasksCreated = 0;

    this.state.lastCycle = new Date().toISOString();
    
    return { tasksCompleted, tasksCreated };
  }
}

export const swarmOrchestrator = new SwarmOrchestrator();