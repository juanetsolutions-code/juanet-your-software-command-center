import { logger } from "@/lib/utils/logger";
import { saveCheckpoint } from "./workflow-checkpoints";
import { runPipeline, type PipelineStep } from "./execution-pipeline";

export interface RuntimeWorkflow {
  id: string;
  tenantId: string;
  steps: PipelineStep[];
}

export interface RuntimeResult {
  workflowId: string;
  status: "completed" | "failed" | "paused";
  context: Record<string, unknown>;
  error?: string;
}

export async function runWorkflow(
  wf: RuntimeWorkflow,
  initial: Record<string, unknown> = {},
): Promise<RuntimeResult> {
  logger.info(`[AutomationRuntime] start ${wf.id}`);
  try {
    const context = await runPipeline(wf.steps, initial, (stepId, ctx) =>
      saveCheckpoint({ workflowId: wf.id, stepId, context: ctx, tenantId: wf.tenantId }),
    );
    return { workflowId: wf.id, status: "completed", context };
  } catch (err) {
    return {
      workflowId: wf.id,
      status: "failed",
      context: initial,
      error: (err as Error).message,
    };
  }
}
