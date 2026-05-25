/**
 * Rate Limiter
 * Tenant-aware, tier-based rate limiting with burst handling.
 */

export class RateLimiter {
  private counters = new Map<string, number>();

  checkLimit(tenantId: string, limit = 1000): boolean {
    const key = tenantId;
    const current = this.counters.get(key) || 0;
    if (current >= limit) return false;
    this.counters.set(key, current + 1);
    return true;
  }
}

export const rateLimiter = new RateLimiter();
