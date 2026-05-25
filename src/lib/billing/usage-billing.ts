/**
 * Usage Billing
 * Aggregates usage events into billable line items.
 */

export interface UsageLineItem {
  tenantId: string;
  metric: string;
  quantity: number;
  unitPrice: number;
  total: number;
  period: string;
}

export class UsageBilling {
  aggregate(
    tenantId: string,
    usage: Record<string, number>,
    prices: Record<string, number>,
  ): UsageLineItem[] {
    return Object.keys(usage).map((metric) => ({
      tenantId,
      metric,
      quantity: usage[metric],
      unitPrice: prices[metric] || 0,
      total: usage[metric] * (prices[metric] || 0),
      period: new Date().toISOString().slice(0, 7),
    }));
  }
}

export const usageBilling = new UsageBilling();
