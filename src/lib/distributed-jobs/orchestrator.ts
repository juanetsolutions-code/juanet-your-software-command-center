/**
 * Distributed Job Orchestrator
 * Provider-agnostic coordination layer. Mock-safe; no external queue required.
 */
import { logger } from "@/lib/utils/logger";
import { routeJob } from "./execution-router";
import { computePriority, type JobPriority } from "./job-priority";
import { withRetry, type RetryPolicy } from "./retry-strategy";

export interface DistributedJob<TPayload = unknown> {
  id: string;
  name: string;
  tenantId: string;
  payload: TPayload;
  priority?: JobPriority;
  idempotencyKey?: string;
  retry?: RetryPolicy;
  capabilities?: string[];
}

export interface JobDispatchResult {
  jobId: string;
  workerId?: string;
  accepted: boolean;
  reason?: string;
}

const seenIdempotencyKeys = new Set<string>();

export async function dispatchJob<T>(job: DistributedJob<T>): Promise<JobDispatchResult> {
  if (job.idempotencyKey && seenIdempotencyKeys.has(job.idempotencyKey)) {
    return { jobId: job.id, accepted: false, reason: "duplicate" };
  }
  if (job.idempotencyKey) seenIdempotencyKeys.add(job.idempotencyKey);

  const priority = job.priority ?? computePriority(job);
  const worker = routeJob({ capabilities: job.capabilities ?? [] });

  logger.info(`[DistributedJobs] dispatch ${job.name} -> ${worker?.id ?? "local"} (p=${priority})`);
  return { jobId: job.id, workerId: worker?.id, accepted: true };
}

export async function executeJob<T>(
  job: DistributedJob<T>,
  handler: (job: DistributedJob<T>) => Promise<void>,
) {
  return withRetry(job.name, () => handler(job), job.retry);
}
