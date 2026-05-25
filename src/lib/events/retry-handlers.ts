/**
 * Retry Handlers
 * Configurable retry logic for event delivery with exponential backoff.
 */

export interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  maxBackoffMs: number;
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 5,
  backoffMs: 1000,
  maxBackoffMs: 30000,
};

export class RetryHandlers {
  calculateDelay(attempt: number, config: RetryConfig = defaultRetryConfig): number {
    const delay = Math.min(config.backoffMs * Math.pow(2, attempt), config.maxBackoffMs);
    return delay;
  }

  shouldRetry(attempt: number, config: RetryConfig = defaultRetryConfig): boolean {
    return attempt < config.maxAttempts;
  }
}

export const retryHandlers = new RetryHandlers();
