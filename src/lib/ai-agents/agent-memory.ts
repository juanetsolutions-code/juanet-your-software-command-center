/**
 * Agent Memory (light wrapper)
 * Per-agent short-term memory. Full long-term memory lives in src/lib/ai-memory/
 */

import type { AgentState } from './agent-types';

const agentMemories = new Map<string, AgentState>();

export function getAgentMemory(agentId: string): AgentState | undefined {
  return agentMemories.get(agentId);
}

export function updateAgentMemory(agentId: string, state: Partial<AgentState>): void {
  const existing = agentMemories.get(agentId) || ({} as AgentState);
  agentMemories.set(agentId, { ...existing, ...state, lastActivity: new Date().toISOString() });
}

export function clearAgentMemory(agentId: string): void {
  agentMemories.delete(agentId);
}
