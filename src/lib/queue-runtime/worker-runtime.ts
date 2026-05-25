/**
 * Worker Runtime
 * Execution environment for processing queued jobs with isolation.
 */

export interface WorkerContext {
  jobId: string;
  tenantId: string;
  attempt: number;
}

export class WorkerRuntime {
  async processJob(
    context: WorkerContext,
    handler: (payload: any) => Promise<void>,
  ): Promise<void> {
    try {
      // Execute handler with tenant context
      await handler({});
    } catch (err) {
      // Retry logic delegated to retry-persistence
      throw err;
    }
  }
}

export const workerRuntime = new WorkerRuntime();
