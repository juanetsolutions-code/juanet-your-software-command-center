/**
 * Recurring Jobs
 * High-level recurring job management with timezone support.
 */

export interface RecurringJob {
  id: string;
  tenantId: string;
  name: string;
  interval: string;
  timezone: string;
  lastRun?: string;
}

export class RecurringJobs {
  private jobs: RecurringJob[] = [];

  create(tenantId: string, name: string, interval: string, timezone = "UTC"): RecurringJob {
    const job: RecurringJob = { id: `rec-${Date.now()}`, tenantId, name, interval, timezone };
    this.jobs.push(job);
    return job;
  }
}

export const recurringJobs = new RecurringJobs();
