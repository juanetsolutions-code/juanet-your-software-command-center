import { findAgentsByCapability, type WorkforceAgent } from "./ai-agent-registry";
import type { AgentCapability } from "./agent-capabilities";

export interface DelegationRequest {
  tenantId: string;
  capability: AgentCapability;
  payload: Record<string, unknown>;
  preferredAgentId?: string;
}

export interface DelegationResult {
  agent: WorkforceAgent | null;
  accepted: boolean;
  reason?: string;
}

export function delegateTask(req: DelegationRequest): DelegationResult {
  const candidates = findAgentsByCapability(req.tenantId, req.capability);
  if (candidates.length === 0) return { agent: null, accepted: false, reason: "no_agent" };
  const preferred = req.preferredAgentId
    ? candidates.find((a) => a.id === req.preferredAgentId)
    : undefined;
  const idle = candidates.find((a) => a.status === "idle");
  const agent = preferred ?? idle ?? candidates[0];
  return { agent, accepted: true };
}
