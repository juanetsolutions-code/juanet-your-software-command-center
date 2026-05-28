import type { ActionResult } from "./action-executor";

export type RollbackRecord = {
  actionId: string;
  rollbackData: Record<string, unknown>;
  executedAt: string;
};

export class RollbackEngine {
  private rollbacks: Map<string, RollbackRecord> = new Map();

  register(actionId: string, rollbackData: Record<string, unknown>): void {
    this.rollbacks.set(actionId, {
      actionId,
      rollbackData,
      executedAt: new Date().toISOString(),
    });
  }

  async rollback(actionId: string): Promise<boolean> {
    const record = this.rollbacks.get(actionId);
    if (!record) return false;

    // Execute rollback logic based on action type
    console.log(`Rolling back action ${actionId}`, record.rollbackData);
    
    this.rollbacks.delete(actionId);
    return true;
  }

  hasRollback(actionId: string): boolean {
    return this.rollbacks.has(actionId);
  }
}

export const rollbackEngine = new RollbackEngine();