/**
 * Job Dispatcher
 * Routes jobs to appropriate workers with load balancing.
 */

import { queueEngine } from "./queue-engine";

export class JobDispatcher {
  async dispatch(type: string, payload: any, tenantId: string): Promise<string> {
    const job = await queueEngine.enqueue(type, payload, tenantId);
    // In real: publish to worker pool or external queue
    return job.id;
  }
}

export const jobDispatcher = new JobDispatcher();
