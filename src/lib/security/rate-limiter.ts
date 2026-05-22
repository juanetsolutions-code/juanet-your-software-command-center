/**
 * Rate Limiter (in-memory, production-ready for small scale)
 * Protects sensitive operations: auth, messages, payments.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitOptions {
  windowMs: number; // e.g. 60000 for 1 minute
  maxRequests: number;
}

const DEFAULTS: Record<string, RateLimitOptions> = {
  auth: { windowMs: 60_000, maxRequests: 10 },
  message: { windowMs: 60_000, maxRequests: 30 },
  payment: { windowMs: 300_000, maxRequests: 5 },
  default: { windowMs: 60_000, maxRequests: 20 },
};

export function checkRateLimit(
  key: string,
  category: keyof typeof DEFAULTS = "default",
): { allowed: boolean; retryAfter?: number } {
  const opts = DEFAULTS[category] || DEFAULTS.default;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true };
  }

  if (entry.count >= opts.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  entry.count++;
  return { allowed: true };
}

export function resetRateLimit(key: string): void {
  store.delete(key);
}

export function clearAllRateLimits(): void {
  store.clear();
}
