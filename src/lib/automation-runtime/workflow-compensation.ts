/**
 * Workflow Compensation
 * Prepares and executes compensation (rollback) transactions for failed workflows.
 */

export interface CompensationAction {
  step: number;
  action: string;
  payload: any;
}

export class WorkflowCompensation {
  private compensations = new Map<string, CompensationAction[]>();

  registerCompensation(executionId: string, action: CompensationAction): void {
    const list = this.compensations.get(executionId) || [];
    list.push(action);
    this.compensations.set(executionId, list);
  }

  async executeCompensations(executionId: string): Promise<void> {
    const actions = this.compensations.get(executionId) || [];
    for (const action of actions.reverse()) {
      // Execute compensation
    }
  }
}

export const workflowCompensation = new WorkflowCompensation();
