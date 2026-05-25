/**
 * Autonomous Agent Infrastructure - Agent Task Router
 * Routes tasks to appropriate agents based on capability and load.
 */

import type { AgentDefinition, AgentTask } from "./agent-types";

export class AgentTaskRouter {
  route(task: any, agent: AgentDefinition, tenantId: string): AgentTask {
    return {
      id: `task_${Date.now()}`,
      type: task.type,
      payload: task.payload,
      priority: task.priority || 5,
      tenantId,
    };
  }
}

export const agentTaskRouter = new AgentTaskRouter();
