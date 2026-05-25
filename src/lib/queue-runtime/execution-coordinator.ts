/**
 * Execution Coordinator
 * Coordinates distributed job execution, locking, and deduplication.
 */

export class ExecutionCoordinator {
  private activeLocks = new Set<string>();

  async acquireLock(jobId: string, tenantId: string): Promise<boolean> {
    const lockKey = `${tenantId}:${jobId}`;
    if (this.activeLocks.has(lockKey)) return false;
    this.activeLocks.add(lockKey);
    return true;
  }

  releaseLock(jobId: string, tenantId: string): void {
    this.activeLocks.delete(`${tenantId}:${jobId}`);
  }
}

export const executionCoordinator = new ExecutionCoordinator();
