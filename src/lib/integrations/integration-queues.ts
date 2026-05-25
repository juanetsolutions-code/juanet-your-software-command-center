/**
 * Integration Queues
 * Reliable queuing for integration events and sync jobs.
 */

export interface QueuedIntegrationJob {
  id: string;
  tenantId: string;
  provider: string;
  payload: any;
  enqueuedAt: string;
}

export class IntegrationQueues {
  private queue: QueuedIntegrationJob[] = [];

  enqueue(tenantId: string, provider: string, payload: any): QueuedIntegrationJob {
    const job: QueuedIntegrationJob = {
      id: `iq-${Date.now()}`,
      tenantId,
      provider,
      payload,
      enqueuedAt: new Date().toISOString(),
    };
    this.queue.push(job);
    return job;
  }
}

export const integrationQueues = new IntegrationQueues();
