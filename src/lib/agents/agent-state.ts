/**
 * Autonomous Agent Infrastructure - Agent State
 * Manages persistent state and context for long-running agents.
 */

import type { AgentStateSnapshot } from "./agent-types";

export class AgentState {
  private stateStore: Map<string, AgentStateSnapshot> = new Map();

  save(agentId: string, snapshot: AgentStateSnapshot): void {
    this.stateStore.set(agentId, {
      ...snapshot,
      lastUpdated: new Date().toISOString(),
    });
  }

  load(agentId: string): AgentStateSnapshot | undefined {
    return this.stateStore.get(agentId);
  }

  clear(agentId: string): void {
    this.stateStore.delete(agentId);
  }
}

export const agentState = new AgentState();
