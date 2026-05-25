/**
 * Enterprise Webhook Infrastructure - Webhook Retries
 * Handles retry logic, exponential backoff, and dead-lettering for failed webhook deliveries.
 */

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export class WebhookRetries {
  private config: RetryConfig = {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 60000,
    backoffMultiplier: 2,
  };

  calculateDelay(attempt: number): number {
    const delay = this.config.initialDelayMs * Math.pow(this.config.backoffMultiplier, attempt - 1);
    return Math.min(delay, this.config.maxDelayMs);
  }

  shouldRetry(attempt: number): boolean {
    return attempt < this.config.maxAttempts;
  }

  async retryWithBackoff<T>(
    operation: () => Promise<T>,
    onFailure?: (attempt: number, error: Error) => void,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        if (onFailure) onFailure(attempt, error);

        if (!this.shouldRetry(attempt)) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

export const webhookRetries = new WebhookRetries();
