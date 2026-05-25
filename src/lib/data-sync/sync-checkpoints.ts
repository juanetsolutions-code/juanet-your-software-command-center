/**
 * Data Synchronization Engine - Sync Checkpoints
 * Manages checkpoints for resumable and reliable data synchronization.
 */

export interface SyncCheckpoint {
  id: string;
  tenantId: string;
  syncJobId: string;
  lastProcessedId: string;
  lastProcessedAt: string;
  metadata: Record<string, any>;
}

export class SyncCheckpoints {
  private checkpoints: SyncCheckpoint[] = [];

  saveCheckpoint(
    jobId: string,
    tenantId: string,
    lastProcessedId: string,
    metadata: Record<string, any> = {},
  ): SyncCheckpoint {
    const checkpoint: SyncCheckpoint = {
      id: `checkpoint_${Date.now()}`,
      tenantId,
      syncJobId: jobId,
      lastProcessedId,
      lastProcessedAt: new Date().toISOString(),
      metadata,
    };
    this.checkpoints = this.checkpoints.filter(
      (c) => !(c.syncJobId === jobId && c.tenantId === tenantId),
    );
    this.checkpoints.push(checkpoint);
    return checkpoint;
  }

  getCheckpoint(jobId: string, tenantId: string): SyncCheckpoint | undefined {
    return this.checkpoints.find((c) => c.syncJobId === jobId && c.tenantId === tenantId);
  }
}

export const syncCheckpoints = new SyncCheckpoints();
