/**
 * Enterprise Workflow Engine - Workflow Builder
 * Builder pattern for constructing complex enterprise workflows.
 */

import type { WorkflowDefinition, WorkflowStep } from "./workflow-types";

export class WorkflowBuilder {
  private steps: WorkflowStep[] = [];
  private name: string = "";

  setName(name: string): this {
    this.name = name;
    return this;
  }

  addStep(step: WorkflowStep): this {
    this.steps.push(step);
    return this;
  }

  build(tenantId: string): WorkflowDefinition {
    if (!this.name || this.steps.length === 0) {
      throw new Error("Workflow must have a name and at least one step");
    }

    return {
      id: `wfdef_${Date.now()}`,
      tenantId,
      name: this.name,
      steps: this.steps,
      version: 1,
      createdAt: new Date().toISOString(),
    };
  }
}
