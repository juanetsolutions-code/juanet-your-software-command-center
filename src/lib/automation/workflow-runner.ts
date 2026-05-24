/**
 * Workflow Runner - Executes automation workflows.
 */

import type { AutomationWorkflow } from "./automation-types";
import { evaluateTrigger } from "./trigger-system";
import { executeAction } from "./action-registry";

export async function runWorkflow(workflow: AutomationWorkflow, triggerData: any) {
  const triggerPassed = await evaluateTrigger(workflow.trigger.type, workflow.trigger.config);
  if (!triggerPassed) return { status: "skipped" };

  const results: any[] = [];

  for (const action of workflow.actions) {
    try {
      const result = await executeAction(action.type, action.config, {
        triggerData,
        workflow,
      });
      results.push(result);
    } catch (error) {
      return { status: "failed", error: (error as Error).message };
    }
  }

  return { status: "completed", results };
}
