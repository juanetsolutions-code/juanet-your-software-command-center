/**
 * Delayed Execution
 * Handles one-time future execution of tasks.
 */

export interface DelayedTask {
  id: string;
  tenantId: string;
  executeAt: string;
  payload: any;
  executed: boolean;
}

export class DelayedExecution {
  private tasks: DelayedTask[] = [];

  schedule(tenantId: string, executeAt: string, payload: any): DelayedTask {
    const task: DelayedTask = {
      id: `delayed-${Date.now()}`,
      tenantId,
      executeAt,
      payload,
      executed: false,
    };
    this.tasks.push(task);
    return task;
  }

  getPending(now = new Date()): DelayedTask[] {
    return this.tasks.filter((t) => !t.executed && new Date(t.executeAt) <= now);
  }
}

export const delayedExecution = new DelayedExecution();
