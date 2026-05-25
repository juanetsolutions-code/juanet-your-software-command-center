/**
 * Autonomous Agent Infrastructure - Agent Registry
 * Central registry for all AI agents with role and capability management.
 */

import type { AgentDefinition, AgentRole } from "./agent-types";

export class AgentRegistry {
  private agents: Map<string, AgentDefinition> = new Map();

  register(definition: AgentDefinition): void {
    this.agents.set(definition.id, definition);
  }

  get(id: string): AgentDefinition | undefined {
    return this.agents.get(id);
  }

  getByRole(role: AgentRole): AgentDefinition[] {
    return Array.from(this.agents.values()).filter((a) => a.role === role);
  }

  listAll(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }
}

export const agentRegistry = new AgentRegistry();
