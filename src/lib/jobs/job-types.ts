/**
 * Job Types and Scheduler
 */

export interface Job {
  name: string;
  data: any;
  runAt: number;
}

export function scheduleJob(name: string, data: any, delayMs: number) {
  // Would integrate with job-queue
  console.log(`[Jobs] Scheduled ${name} in ${delayMs}ms`);
}
