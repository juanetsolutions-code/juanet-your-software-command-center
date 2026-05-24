/**
 * Execution Planner for multi-agent tasks.
 */

export function createExecutionPlan(task: string, availableAgents: string[]) {
  return {
    task,
    assignedAgents: availableAgents.slice(0, 2), // simple
    estimatedSteps: 3,
  };
}
