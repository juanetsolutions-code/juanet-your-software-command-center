/**
 * Workflow Evolution
 * Models how workflows improve over time through learning and adaptation.
 * No UI changes.
 */

export interface WorkflowVersion {
  version: string;
  changes: string[];
  performanceDelta: number;
  adoptionRate: number;
  createdAt: string;
}

export class WorkflowEvolution {
  private versions = new Map<string, WorkflowVersion[]>();

  evolve(
    tenantId: string,
    workflowId: string,
    improvement: string,
    perfDelta: number,
  ): WorkflowVersion {
    const key = `${tenantId}:${workflowId}`;
    if (!this.versions.has(key)) this.versions.set(key, []);

    const ver: WorkflowVersion = {
      version: `v${this.versions.get(key)!.length + 1}`,
      changes: [improvement],
      performanceDelta: perfDelta,
      adoptionRate: 0.3,
      createdAt: new Date().toISOString(),
    };
    this.versions.get(key)!.push(ver);
    return ver;
  }
}

export const workflowEvolution = new WorkflowEvolution();
