/**
 * Execution Persistence
 * Durable storage of workflow execution state for recovery and audit.
 */

export interface StoredExecutionState {
  executionId: string;
  tenantId: string;
  workflowId: string;
  status: string;
  currentStep: number;
  variables: Record<string, any>;
  lastUpdated: string;
}

export class ExecutionPersistence {
  private store = new Map<string, StoredExecutionState>();

  save(state: StoredExecutionState): void {
    this.store.set(state.executionId, { ...state, lastUpdated: new Date().toISOString() });
  }

  load(executionId: string): StoredExecutionState | undefined {
    return this.store.get(executionId);
  }

  getAllForTenant(tenantId: string): StoredExecutionState[] {
    return Array.from(this.store.values()).filter((s) => s.tenantId === tenantId);
  }
}

export const executionPersistence = new ExecutionPersistence();
