import { logger } from "@/lib/utils/logger";

export interface RetryPolicy {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

const DEFAULT: Required<RetryPolicy> = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 10_000,
  jitter: true,
};

export async function withRetry<T>(
  name: string,
  fn: () => Promise<T>,
  policy: RetryPolicy = {},
): Promise<{ success: boolean; attempts: number; result?: T; error?: string }> {
  const cfg = { ...DEFAULT, ...policy };
  let lastErr: unknown;
  for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
    try {
      const result = await fn();
      return { success: true, attempts: attempt, result };
    } catch (err) {
      lastErr = err;
      const expo = Math.min(cfg.maxDelayMs, cfg.baseDelayMs * Math.pow(2, attempt - 1));
      const delay = cfg.jitter ? Math.floor(expo * (0.5 + Math.random() * 0.5)) : expo;
      logger.warn(`[Retry] ${name} attempt ${attempt} failed, retrying in ${delay}ms`);
      if (attempt < cfg.maxAttempts) await new Promise((r) => setTimeout(r, delay));
    }
  }
  return {
    success: false,
    attempts: cfg.maxAttempts,
    error: String((lastErr as Error)?.message ?? lastErr),
  };
}
