/**
 * Autonomous Agent Infrastructure - Agent Coordinator
 * Multi-agent coordination, handoff, and orchestration logic.
 */

import type { AgentDefinition } from "./agent-types";
import { agentRegistry } from "./agent-registry";
import { agentTaskRouter } from "./agent-task-router";

export class AgentCoordinator {
  async coordinate(task: any, tenantId: string): Promise<any> {
    const suitableAgents = agentRegistry.getByRole(task.preferredRole || "general");

    if (suitableAgents.length === 0) {
      throw new Error("No suitable agents available for task");
    }

    // Simple round-robin / first available for now
    const selected = suitableAgents[0];
    const routedTask = await agentTaskRouter.route(task, selected, tenantId);

    return {
      coordinator: "AgentCoordinator",
      selectedAgent: selected.id,
      routedTask,
      tenantId,
    };
  }
}

export const agentCoordinator = new AgentCoordinator();
