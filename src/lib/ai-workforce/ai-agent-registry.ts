import type { AgentCapability } from "./agent-capabilities";

export interface WorkforceAgent {
  id: string;
  tenantId: string;
  name: string;
  role: string;
  capabilities: AgentCapability[];
  status: "idle" | "busy" | "offline";
  costPerCallUsd?: number;
}

const registry = new Map<string, WorkforceAgent>();

export function registerAgent(agent: WorkforceAgent) {
  registry.set(agent.id, agent);
}

export function getAgent(id: string) {
  return registry.get(id);
}

export function listAgentsForTenant(tenantId: string) {
  return Array.from(registry.values()).filter((a) => a.tenantId === tenantId);
}

export function findAgentsByCapability(tenantId: string, cap: AgentCapability) {
  return listAgentsForTenant(tenantId).filter((a) => a.capabilities.includes(cap));
}
