/**
 * Workflow Engine
 * Orchestrates multi-step workflows with branching and retries.
 */

import type { WorkflowDefinition, WorkflowRun } from "./workflow-definitions";
import { executeStep } from "./step-executor";

const activeRuns = new Map<string, WorkflowRun>();

export async function startWorkflow(
  definition: WorkflowDefinition,
  tenantId: string,
  initialContext: Record<string, any> = {},
): Promise<WorkflowRun> {
  const run: WorkflowRun = {
    id: `run_${Date.now()}`,
    workflowId: definition.id,
    tenantId,
    status: "running",
    currentStep: definition.steps[0]?.id,
    startedAt: new Date().toISOString(),
    context: { ...initialContext },
  };

  activeRuns.set(run.id, run);

  // Start execution (non-blocking for now)
  runWorkflow(run, definition).catch((err) => {
    run.status = "failed";
    run.error = err.message;
  });

  return run;
}

async function runWorkflow(run: WorkflowRun, definition: WorkflowDefinition) {
  for (const step of definition.steps) {
    run.currentStep = step.id;
    try {
      const result = await executeStep(step, run.context, run.tenantId);
      run.context = { ...run.context, ...result };
    } catch (err: any) {
      run.status = "failed";
      run.error = err.message;
      return;
    }
  }
  run.status = "completed";
  run.completedAt = new Date().toISOString();
}
