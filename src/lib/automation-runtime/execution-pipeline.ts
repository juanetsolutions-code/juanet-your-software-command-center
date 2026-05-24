export interface PipelineStep {
  id: string;
  run: (ctx: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export async function runPipeline(
  steps: PipelineStep[],
  initial: Record<string, unknown>,
  onStepComplete?: (stepId: string, ctx: Record<string, unknown>) => void | Promise<void>,
): Promise<Record<string, unknown>> {
  let ctx = { ...initial };
  for (const step of steps) {
    const result = await step.run(ctx);
    ctx = { ...ctx, ...result };
    if (onStepComplete) await onStepComplete(step.id, ctx);
  }
  return ctx;
}
