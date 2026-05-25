/**
 * Enterprise Workflow Engine - Workflow Transitions
 * Handles moving between steps and handling different transition types.
 */

import type { WorkflowInstance, WorkflowStep } from "./workflow-types";

export class WorkflowTransitions {
  getNextStep(currentStep: WorkflowStep, instance: WorkflowInstance): string | null {
    if (!currentStep.nextSteps || currentStep.nextSteps.length === 0) {
      return null;
    }
    // For now, take the first next step. Real version would evaluate conditions.
    return currentStep.nextSteps[0];
  }

  shouldParallelize(step: WorkflowStep): boolean {
    return step.type === "parallel";
  }
}

export const workflowTransitions = new WorkflowTransitions();
