/**
 * Retry Persistence
 * Persists retry state and backoff for failed jobs.
 */

export interface RetryState {
  jobId: string;
  attempts: number;
  nextRetryAt: string;
  lastError?: string;
}

export class RetryPersistence {
  private states = new Map<string, RetryState>();

  recordFailure(jobId: string, error: string, nextRetryAt: string): RetryState {
    const state: RetryState = {
      jobId,
      attempts: (this.states.get(jobId)?.attempts || 0) + 1,
      nextRetryAt,
      lastError: error,
    };
    this.states.set(jobId, state);
    return state;
  }

  getState(jobId: string): RetryState | undefined {
    return this.states.get(jobId);
  }
}

export const retryPersistence = new RetryPersistence();
