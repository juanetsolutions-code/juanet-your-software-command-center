import { getTenantUsage } from "./token-metering";

interface Budget {
  monthlyUsd: number;
  hardCap: boolean;
}

const budgets = new Map<string, Budget>();

export function setBudget(tenantId: string, budget: Budget) {
  budgets.set(tenantId, budget);
}

export function checkBudget(tenantId: string): { allowed: boolean; spentUsd: number; budgetUsd?: number } {
  const b = budgets.get(tenantId);
  const { costUsd } = getTenantUsage(tenantId);
  if (!b) return { allowed: true, spentUsd: costUsd };
  if (b.hardCap && costUsd >= b.monthlyUsd) {
    return { allowed: false, spentUsd: costUsd, budgetUsd: b.monthlyUsd };
  }
  return { allowed: true, spentUsd: costUsd, budgetUsd: b.monthlyUsd };
}
