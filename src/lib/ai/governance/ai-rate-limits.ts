/**
 * AI Rate Limits for governance.
 */

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkAIRateLimit(tenantId: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const key = tenantId;
  const entry = rateLimits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
