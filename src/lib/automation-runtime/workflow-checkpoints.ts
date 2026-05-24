export interface Checkpoint {
  workflowId: string;
  stepId: string;
  context: Record<string, unknown>;
  tenantId: string;
  createdAt?: string;
}

const checkpoints: Checkpoint[] = [];

export function saveCheckpoint(cp: Checkpoint) {
  checkpoints.push({ ...cp, createdAt: new Date().toISOString() });
  if (checkpoints.length > 2000) checkpoints.shift();
}

export function getLatestCheckpoint(workflowId: string): Checkpoint | null {
  for (let i = checkpoints.length - 1; i >= 0; i--) {
    if (checkpoints[i].workflowId === workflowId) return checkpoints[i];
  }
  return null;
}

export function listCheckpoints(workflowId: string): Checkpoint[] {
  return checkpoints.filter((c) => c.workflowId === workflowId);
}
