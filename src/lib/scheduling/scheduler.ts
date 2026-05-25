/**
 * Scheduler
 * Core scheduling engine for delayed and recurring tasks.
 */

export interface ScheduledJob {
  id: string;
  tenantId: string;
  type: string;
  scheduledAt: string;
  payload: any;
  status: "pending" | "executed" | "cancelled";
}

export class Scheduler {
  private jobs: ScheduledJob[] = [];

  schedule(tenantId: string, type: string, scheduledAt: string, payload: any): ScheduledJob {
    const job: ScheduledJob = {
      id: `job-${Date.now()}`,
      tenantId,
      type,
      scheduledAt,
      payload,
      status: "pending",
    };
    this.jobs.push(job);
    return job;
  }

  getDueJobs(now = new Date()): ScheduledJob[] {
    return this.jobs.filter((j) => j.status === "pending" && new Date(j.scheduledAt) <= now);
  }
}

export const scheduler = new Scheduler();
