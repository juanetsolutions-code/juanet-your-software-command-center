/**
 * Step Executor for workflows.
 */

export async function executeStep(
  step: any,
  context: Record<string, any>,
  tenantId: string,
): Promise<Record<string, any>> {
  switch (step.type) {
    case "action":
      // Delegate to automation executor
      const { executeAction } = require("@/lib/automation/executor");
      return executeAction(step.config.action, step.config, { ...context, tenantId });
    case "condition":
      // Simple condition evaluation
      return { conditionMet: true }; // placeholder
    case "delay":
      await new Promise((r) => setTimeout(r, step.config.ms || 1000));
      return {};
    default:
      return {};
  }
}
