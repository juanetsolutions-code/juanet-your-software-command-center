import { getLatestCheckpoint } from "./workflow-checkpoints";

export interface RollbackResult {
  workflowId: string;
  rolledBack: boolean;
  restoredContext?: Record<string, unknown>;
  reason?: string;
}

export function rollbackWorkflow(workflowId: string): RollbackResult {
  const cp = getLatestCheckpoint(workflowId);
  if (!cp) return { workflowId, rolledBack: false, reason: "no_checkpoint" };
  return { workflowId, rolledBack: true, restoredContext: cp.context };
}
