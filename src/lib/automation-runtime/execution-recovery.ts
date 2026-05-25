/**
 * Execution Recovery
 * Handles recovery of failed or interrupted workflow executions.
 */

import { executionPersistence } from "./execution-persistence";
import { executionStateMachine } from "./execution-state-machine";

export class ExecutionRecovery {
  recover(executionId: string): { success: boolean; newStatus?: string } {
    const state = executionPersistence.load(executionId);
    if (!state) return { success: false };

    const recoveredStatus = executionStateMachine.transition(state.status as any, "recover");
    const newState = { ...state, status: recoveredStatus };
    executionPersistence.save(newState);

    return { success: true, newStatus: recoveredStatus };
  }
}

export const executionRecovery = new ExecutionRecovery();
