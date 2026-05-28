import type { Job, JobHandler, JobPriority, JobStatus, RetryPolicy } from "./dead-letter-queue";

export type SchedulerConfig = {
  maxConcurrentJobs: number;
  defaultRetryPolicy: RetryPolicy;
  enableDLQ: boolean;
};

const DEFAULT_CONFIG: SchedulerConfig = {
  maxConcurrentJobs: 10,
  defaultRetryPolicy: {
    maxAttempts: 3,
    backoffMs: 1000,
    exponential: true,
    maxBackoffMs: 30000,
  },
  enableDLQ: true,
};

class JobScheduler {
  private jobs: Map<string, Job> = new Map();
  private handlers: Map<string, JobHandler> = new Map();
  private config: SchedulerConfig = DEFAULT_CONFIG;
  private runningJobs: Set<string> = new Set();
  private queue: Job[] = [];
  private isProcessing = false;

  registerHandler(type: string, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  unregisterHandler(type: string): void {
    this.handlers.delete(type);
  }

  schedule(job: Omit<Job, "id" | "status" | "attempts" | "createdAt">): Job {
    const fullJob: Job = {
      ...job,
      id: generateJobId(job.type),
      status: "pending",
      attempts: 0,
      createdAt: new Date().toISOString(),
      maxAttempts: this.config.defaultRetryPolicy.maxAttempts,
    };

    this.queue.push(fullJob);
    this.jobs.set(fullJob.id, fullJob);

    if (!this.isProcessing) {
      this.processQueue();
    }

    return fullJob;
  }

  private async processQueue(): Promise<void> {
    if (this.runningJobs.size >= this.config.maxConcurrentJobs) {
      return;
    }

    this.isProcessing = true;

    const sortedQueue = this.queue.sort((a, b) => this.getPriorityValue(a.priority) - this.getPriorityValue(b.priority));
    const job = sortedQueue.shift();

    if (!job) {
      this.isProcessing = false;
      return;
    }

    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "failed";
      job.error = `No handler for job type: ${job.type}`;
      job.failedAt = new Date().toISOString();
      this.jobs.set(job.id, job);
      this.processQueue();
      return;
    }

    this.runningJobs.add(job.id);
    job.status = "running";
    job.startedAt = new Date().toISOString();
    this.jobs.set(job.id, job);

    try {
      const result = await handler(job);
      job.status = "completed";
      job.result = result;
      job.completedAt = new Date().toISOString();
      this.jobs.set(job.id, job);
    } catch (error) {
      job.attempts += 1;
      job.error = error instanceof Error ? error.message : String(error);
      
      if (job.attempts >= job.maxAttempts) {
        job.status = "dead-letter";
        job.failedAt = new Date().toISOString();
        this.jobs.set(job.id, job);
      } else {
        job.status = "retrying";
        job.scheduledAt = new Date(Date.now() + this.calculateBackoff(job.attempts)).toISOString();
        this.jobs.set(job.id, job);
      }
    } finally {
      this.runningJobs.delete(job.id);
      this.processQueue();
    }
  }

  private getPriorityValue(priority: JobPriority): number {
    const values: Record<JobPriority, number> = {
      critical: 0,
      high: 1,
      normal: 2,
      low: 3,
      background: 4,
    };
    return values[priority] ?? 2;
  }

  private calculateBackoff(attempt: number): number {
    const policy = this.config.defaultRetryPolicy;
    if (policy.exponential) {
      const delay = policy.backoffMs * Math.pow(2, attempt - 1);
      return Math.min(delay, policy.maxBackoffMs ?? 60000);
    }
    return policy.backoffMs;
  }

  get(jobId: string): Job | undefined {
    return this.jobs.get(jobId);
  }

  getAll(): Job[] {
    return Array.from(this.jobs.values());
  }

  getPendingJobs(): Job[] {
    return this.getAll().filter((j) => j.status === "pending");
  }

  getRunningJobs(): Job[] {
    return this.getAll().filter((j) => j.status === "running");
  }

  getFailedJobs(): Job[] {
    return this.getAll().filter((j) => j.status === "failed");
  }

  cancel(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (job && job.status === "pending") {
      this.jobs.delete(jobId);
      return true;
    }
    return false;
  }

  updateConfig(config: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export const jobScheduler = new JobScheduler();

export function scheduleJob(
  type: string,
  payload: Record<string, unknown>,
  options?: { 
    priority?: JobPriority; 
    tenantId?: string; 
    maxAttempts?: number;
    scheduledAt?: string;
  }
): Job {
  return jobScheduler.schedule({
    type,
    payload,
    priority: options?.priority ?? "normal",
    tenantId: options?.tenantId,
    maxAttempts: options?.maxAttempts ?? 3,
    scheduledAt: options?.scheduledAt,
  });
}

export function registerJobHandler(type: string, handler: JobHandler): void {
  jobScheduler.registerHandler(type, handler);
}

function generateJobId(type: string): string {
  return `job_${type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}