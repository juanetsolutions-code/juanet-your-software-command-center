/**
 * Execution State Machine
 * Manages deterministic state transitions for long-running workflows.
 */

export type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "paused"
  | "recovering";

export class ExecutionStateMachine {
  transition(current: ExecutionStatus, event: string): ExecutionStatus {
    const transitions: Record<string, Partial<Record<ExecutionStatus, ExecutionStatus>>> = {
      start: { pending: "running" },
      pause: { running: "paused" },
      resume: { paused: "running" },
      fail: { running: "failed" },
      complete: { running: "completed" },
      recover: { failed: "recovering" },
    };
    return transitions[event]?.[current] || current;
  }
}

export const executionStateMachine = new ExecutionStateMachine();
