import type { AgentTask } from "../agent-swarm/agent-types";

export class TenantBoundaries {
  validate(task: AgentTask, tenantId: string): boolean {
    return task.tenantId === tenantId;
  }

  enforceIsolation(task: AgentTask, agentTenant: string): boolean {
    return task.tenantId === agentTenant;
  }
}