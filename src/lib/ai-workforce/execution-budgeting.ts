/**
 * Execution Budgeting
 * Enforces per-tenant AI execution budgets and cost controls.
 */

export class ExecutionBudgeting {
  private budgets = new Map<string, number>();

  setBudget(tenantId: string, amount: number): void {
    this.budgets.set(tenantId, amount);
  }

  canSpend(tenantId: string, cost: number): boolean {
    const current = this.budgets.get(tenantId) || Infinity;
    return current >= cost;
  }

  spend(tenantId: string, cost: number): void {
    const current = this.budgets.get(tenantId) || 0;
    this.budgets.set(tenantId, Math.max(0, current - cost));
  }
}

export const executionBudgeting = new ExecutionBudgeting();
