import type { ActionProposal } from "./decision-arbiter";

export class ConflictResolutionEngine {
  resolve(proposals: ActionProposal[]): ActionProposal[] {
    if (proposals.length <= 1) return proposals;

    const grouped = this.groupByType(proposals);
    const resolved: ActionProposal[] = [];

    for (const [component, componentProposals] of Object.entries(grouped)) {
      resolved.push(this.selectBest(componentProposals));
    }

    return resolved;
  }

  private groupByType(proposals: ActionProposal[]): Record<string, ActionProposal[]> {
    return proposals.reduce((acc, p) => {
      acc[p.component] = acc[p.component] ?? [];
      acc[p.component].push(p);
      return acc;
    }, {} as Record<string, ActionProposal[]>);
  }

  private selectBest(proposals: ActionProposal[]): ActionProposal {
    return proposals.sort((a, b) => b.priority - a.priority)[0];
  }
}