/**
 * Background Job Reliability Upgrade
 * Provides retry with exponential backoff, failure tracking, and DLQ simulation.
 * All jobs are safe and log-only in current implementation.
 */

import { logger } from "@/lib/utils/logger";

export interface JobResult {
  success: boolean;
  attempts: number;
  error?: string;
}

const failureLog: Array<{ job: string; error: string; timestamp: string }> = [];

export async function runWithRetry<T>(
  jobName: string,
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<JobResult> {
  let attempt = 0;
  let lastError: any = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      await fn();
      return { success: true, attempts: attempt };
    } catch (err: any) {
      lastError = err;
      const backoff = Math.pow(2, attempt) * 500; // exponential backoff
      logger.warn(
        `[Jobs] ${jobName} failed (attempt ${attempt}/${maxRetries}). Retrying in ${backoff}ms...`,
      );
      await new Promise((res) => setTimeout(res, backoff));
    }
  }

  // Dead Letter Queue simulation
  failureLog.push({
    job: jobName,
    error: lastError?.message || String(lastError),
    timestamp: new Date().toISOString(),
  });

  logger.error(`[Jobs] ${jobName} permanently failed after ${maxRetries} attempts. Moved to DLQ.`);

  return { success: false, attempts: maxRetries, error: lastError?.message };
}

export function getDeadLetterQueue() {
  return [...failureLog];
}

export function clearDeadLetterQueue() {
  failureLog.length = 0;
}
