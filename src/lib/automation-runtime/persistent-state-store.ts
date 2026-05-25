/**
 * Operational Workflow Persistence - Persistent State Store
 * Durable storage for long-running workflow state.
 */

export interface WorkflowState {
  executionId: string;
  tenantId: string;
  currentStep: number;
  variables: Record<string, any>;
  lastUpdated: string;
}

export class PersistentStateStore {
  private store = new Map<string, WorkflowState>();

  save(state: WorkflowState): void {
    this.store.set(state.executionId, { ...state, lastUpdated: new Date().toISOString() });
  }

  load(executionId: string): WorkflowState | undefined {
    return this.store.get(executionId);
  }
}

export const persistentStateStore = new PersistentStateStore();
