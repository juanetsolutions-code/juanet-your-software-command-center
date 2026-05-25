/**
 * Data Synchronization Engine - Sync Jobs
 * Defines the structure and management of synchronization jobs.
 */

export interface SyncJob {
  id: string;
  tenantId: string;
  connectorId: string;
  direction: "inbound" | "outbound" | "bidirectional";
  status: "pending" | "running" | "paused" | "completed" | "failed";
  lastRunAt?: string;
  nextRunAt?: string;
  config: Record<string, any>;
}

export class SyncJobs {
  private jobs: SyncJob[] = [];

  createJob(job: Omit<SyncJob, "id" | "status">): SyncJob {
    const newJob: SyncJob = {
      ...job,
      id: `syncjob_${Date.now()}`,
      status: "pending",
    };
    this.jobs.push(newJob);
    return newJob;
  }

  getJobsForTenant(tenantId: string): SyncJob[] {
    return this.jobs.filter((j) => j.tenantId === tenantId);
  }
}

export const syncJobs = new SyncJobs();
