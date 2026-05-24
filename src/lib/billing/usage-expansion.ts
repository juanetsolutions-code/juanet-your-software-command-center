/**
 * Expanded Usage Metering for SaaS
 * Tracks storage, AI, automation, API, and realtime usage per tenant.
 * Export-ready for billing and analytics.
 */

export interface UsageMetric {
  tenantId: string;
  resource: "storage" | "ai" | "automation" | "api" | "realtime";
  amount: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const usageLog: UsageMetric[] = [];

export function recordUsageMetric(metric: Omit<UsageMetric, "timestamp">) {
  const entry: UsageMetric = {
    ...metric,
    timestamp: new Date().toISOString(),
  };
  usageLog.push(entry);
}

export function getTenantUsage(
  tenantId: string,
  resource?: UsageMetric["resource"],
): UsageMetric[] {
  return usageLog.filter((m) => m.tenantId === tenantId && (!resource || m.resource === resource));
}

export function getAggregatedUsage(tenantId: string) {
  const metrics = getTenantUsage(tenantId);
  const summary: Record<string, number> = {};

  metrics.forEach((m) => {
    summary[m.resource] = (summary[m.resource] || 0) + m.amount;
  });

  return summary;
}

export function exportUsageForBilling(tenantId: string, from?: string, to?: string): UsageMetric[] {
  let filtered = getTenantUsage(tenantId);

  if (from) {
    filtered = filtered.filter((m) => m.timestamp >= from);
  }
  if (to) {
    filtered = filtered.filter((m) => m.timestamp <= to);
  }

  return filtered;
}

/**
 * AI-specific usage metering hook (called by tool executor and agents).
 */
export function recordAIAgentUsage(tenantId: string, tokens: number, model = "default") {
  recordUsageMetric({
    tenantId,
    resource: "ai",
    amount: tokens,
    unit: "tokens",
    metadata: { model, source: "ai_agent" },
  });
}
