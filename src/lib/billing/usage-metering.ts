/**
 * Usage Metering for quotas.
 */

export interface UsageRecord {
  tenantId: string;
  type: string;
  amount: number;
  timestamp: string;
}

const usageRecords: UsageRecord[] = [];

export function recordUsage(tenantId: string, type: string, amount: number) {
  usageRecords.push({
    tenantId,
    type,
    amount,
    timestamp: new Date().toISOString(),
  });
}

export function getUsage(tenantId: string, type?: string) {
  return usageRecords.filter((r) => r.tenantId === tenantId && (!type || r.type === type));
}
