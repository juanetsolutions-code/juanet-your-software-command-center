/**
 * Provider Rate Limits
 * Enforces per-provider and per-tenant rate limits.
 */

export class ProviderRateLimits {
  private limits = new Map<string, number>();

  checkLimit(provider: string, tenantId: string, limit = 100): boolean {
    const key = `${provider}:${tenantId}`;
    const current = this.limits.get(key) || 0;
    if (current >= limit) return false;
    this.limits.set(key, current + 1);
    return true;
  }
}

export const providerRateLimits = new ProviderRateLimits();
