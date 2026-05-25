/**
 * Enterprise Workflow Engine - Workflow State Machine
 * Manages valid state transitions for enterprise workflows.
 */

import type { WorkflowStatus } from "./workflow-types";

export class WorkflowStateMachine {
  private validTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
    draft: ["active"],
    active: ["paused", "completed", "failed", "cancelled"],
    paused: ["active", "cancelled"],
    completed: [],
    failed: ["active"], // retry
    cancelled: [],
  };

  canTransition(current: WorkflowStatus, next: WorkflowStatus): boolean {
    return this.validTransitions[current]?.includes(next) ?? false;
  }

  transition(current: WorkflowStatus, next: WorkflowStatus): WorkflowStatus {
    if (!this.canTransition(current, next)) {
      throw new Error(`Invalid transition from ${current} to ${next}`);
    }
    return next;
  }
}

export const workflowStateMachine = new WorkflowStateMachine();
