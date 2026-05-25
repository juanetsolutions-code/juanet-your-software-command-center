/**
 * Cron Registry
 * Manages recurring scheduled jobs using cron-like expressions.
 */

export interface CronJob {
  id: string;
  tenantId: string;
  cron: string;
  handler: string;
  enabled: boolean;
}

export class CronRegistry {
  private jobs: CronJob[] = [];

  register(tenantId: string, cron: string, handler: string): CronJob {
    const job: CronJob = { id: `cron-${Date.now()}`, tenantId, cron, handler, enabled: true };
    this.jobs.push(job);
    return job;
  }

  getActive(): CronJob[] {
    return this.jobs.filter((j) => j.enabled);
  }
}

export const cronRegistry = new CronRegistry();
