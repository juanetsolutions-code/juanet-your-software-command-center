/**
 * Caps concurrent execution and per-tenant call rate for AI agents.
 */
interface TenantBudget {
  maxConcurrent: number;
  inFlight: number;
  callsThisMinute: number;
  windowStart: number;
  maxCallsPerMinute: number;
}

const budgets = new Map<string, TenantBudget>();

function getBudget(tenantId: string): TenantBudget {
  let b = budgets.get(tenantId);
  if (!b) {
    b = {
      maxConcurrent: 5,
      inFlight: 0,
      callsThisMinute: 0,
      windowStart: Date.now(),
      maxCallsPerMinute: 60,
    };
    budgets.set(tenantId, b);
  }
  return b;
}

export function canExecute(tenantId: string): { allowed: boolean; reason?: string } {
  const b = getBudget(tenantId);
  if (Date.now() - b.windowStart > 60_000) {
    b.windowStart = Date.now();
    b.callsThisMinute = 0;
  }
  if (b.inFlight >= b.maxConcurrent) return { allowed: false, reason: "concurrency" };
  if (b.callsThisMinute >= b.maxCallsPerMinute) return { allowed: false, reason: "rate" };
  return { allowed: true };
}

export function beginExecution(tenantId: string) {
  const b = getBudget(tenantId);
  b.inFlight++;
  b.callsThisMinute++;
}

export function endExecution(tenantId: string) {
  const b = getBudget(tenantId);
  b.inFlight = Math.max(0, b.inFlight - 1);
}

export function setTenantLimits(
  tenantId: string,
  limits: Partial<Pick<TenantBudget, "maxConcurrent" | "maxCallsPerMinute">>,
) {
  const b = getBudget(tenantId);
  Object.assign(b, limits);
}
