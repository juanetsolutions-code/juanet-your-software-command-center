export type JobPriority = "critical" | "high" | "normal" | "low" | "background";

export type JobStatus = "pending" | "running" | "completed" | "failed" | "retrying" | "dead-letter";

export type Job = {
  id: string;
  type: string;
  tenantId?: string;
  priority: JobPriority;
  status: JobStatus;
  payload: Record<string, unknown>;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
  result?: Record<string, unknown>;
};

export type JobHandler = (job: Job) => Promise<Record<string, unknown> | void>;

export type RetryPolicy = {
  maxAttempts: number;
  backoffMs: number;
  exponential?: boolean;
  maxBackoffMs?: number;
};

class DeadLetterQueue {
  private jobs: Map<string, Job> = new Map();
  private maxSize: number = 10000;

  add(job: Job): void {
    if (this.jobs.size >= this.maxSize) {
      const firstKey = Array.from(this.jobs.keys())[0];
      this.jobs.delete(firstKey);
    }
    this.jobs.set(job.id, job);
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getAll(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.failedAt ?? 0).getTime() - new Date(a.failedAt ?? 0).getTime()
    );
  }

  remove(id: string): boolean {
    return this.jobs.delete(id);
  }

  clear(): void {
    this.jobs.clear();
  }

  size(): number {
    return this.jobs.size;
  }
}

export const deadLetterQueue = new DeadLetterQueue();

export function requeueDLQJob(jobId: string): Job | undefined {
  const job = deadLetterQueue.get(jobId);
  if (job) {
    job.status = "pending";
    job.attempts = 0;
    job.error = undefined;
    job.failedAt = undefined;
    deadLetterQueue.remove(jobId);
  }
  return job;
}

export function moveToDLQ(job: Job): void {
  deadLetterQueue.add(job);
}