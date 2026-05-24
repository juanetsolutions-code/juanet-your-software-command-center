export interface TokenUsageRecord {
  tenantId: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  timestamp: string;
  costUsd?: number;
}

const usage: TokenUsageRecord[] = [];

export function recordUsage(rec: Omit<TokenUsageRecord, "timestamp" | "totalTokens">) {
  const totalTokens = rec.promptTokens + rec.completionTokens;
  usage.push({ ...rec, totalTokens, timestamp: new Date().toISOString() });
  if (usage.length > 5000) usage.shift();
}

export function getTenantUsage(tenantId: string): { tokens: number; costUsd: number } {
  const tenant = usage.filter((u) => u.tenantId === tenantId);
  return {
    tokens: tenant.reduce((s, u) => s + u.totalTokens, 0),
    costUsd: tenant.reduce((s, u) => s + (u.costUsd ?? 0), 0),
  };
}
