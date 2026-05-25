/**
 * Production Queue Runtime - Queue Engine
 * Core async job queue abstraction with provider-agnostic interface.
 */

export interface QueueJob<T = any> {
  id: string;
  type: string;
  payload: T;
  tenantId: string;
  priority: number;
  createdAt: string;
  attempts: number;
}

export class QueueEngine {
  private jobs: QueueJob[] = [];

  async enqueue<T>(type: string, payload: T, tenantId: string, priority = 0): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `job-${Date.now()}`,
      type,
      payload,
      tenantId,
      priority,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };
    this.jobs.push(job as any);
    return job;
  }

  async dequeue(tenantId?: string): Promise<QueueJob | null> {
    const idx = this.jobs.findIndex((j) => !tenantId || j.tenantId === tenantId);
    if (idx === -1) return null;
    const job = this.jobs.splice(idx, 1)[0];
    return job;
  }
}

export const queueEngine = new QueueEngine();
