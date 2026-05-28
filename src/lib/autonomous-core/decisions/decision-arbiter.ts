import type { DomainEvent } from "@/lib/event-bus/event-bus";
import { emitEvent } from "@/lib/event-bus";

export type SystemComponent = "crm" | "agents" | "signals" | "automation" | "billing";

export type ActionProposal = {
  id: string;
  component: SystemComponent;
  action: string;
  priority: number;
  tenantId: string;
  payload: Record<string, unknown>;
};

export type ArbitrationResult = {
  approved: boolean;
  actionId?: string;
  reason?: string;
};

export class DecisionArbiter {
  private proposals: Map<string, ActionProposal[]> = new Map();

  propose(proposal: ActionProposal): void {
    const tenantProposals = this.proposals.get(proposal.tenantId) ?? [];
    tenantProposals.push(proposal);
    this.proposals.set(proposal.tenantId, tenantProposals);
  }

  async arbitrate(tenantId: string): Promise<ActionProposal[]> {
    const proposals = this.proposals.get(tenantId) ?? [];
    const sorted = proposals.sort((a, b) => b.priority - a.priority);
    
    this.proposals.delete(tenantId);
    
    return this.resolveConflicts(sorted);
  }

  private resolveConflicts(proposals: ActionProposal[]): ActionProposal[] {
    const allowedTypes = new Set<string>();
    const resolved: ActionProposal[] = [];

    for (const proposal of proposals) {
      const key = proposal.component;
      if (!allowedTypes.has(key)) {
        allowedTypes.add(key);
        resolved.push(proposal);
      }
    }

    return resolved;
  }
}