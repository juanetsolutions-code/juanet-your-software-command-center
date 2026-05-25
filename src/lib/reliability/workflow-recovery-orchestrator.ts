/**
 * Workflow Recovery Orchestrator
 * Coordinates recovery of distributed workflow executions across failures.
 */

export interface WorkflowRecoveryPlan {
  executionId: string;
  tenantId: string;
  stepsToReplay: number;
  strategy: "replay" | "compensate" | "restart";
}

export class WorkflowRecoveryOrchestrator {
  createPlan(executionId: string, tenantId: string, failedStep: number): WorkflowRecoveryPlan {
    return {
      executionId,
      tenantId,
      stepsToReplay: Math.max(1, failedStep),
      strategy: "replay",
    };
  }
}

export const workflowRecoveryOrchestrator = new WorkflowRecoveryOrchestrator();
