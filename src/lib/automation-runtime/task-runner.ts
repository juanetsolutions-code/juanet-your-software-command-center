/**
 * Task Runner
 * Executes individual tasks within a workflow with retry and timeout support.
 */

export interface TaskResult {
  success: boolean;
  output?: any;
  error?: string;
  durationMs: number;
}

export class TaskRunner {
  async run(taskFn: () => Promise<any>, timeoutMs = 30000): Promise<TaskResult> {
    const start = Date.now();
    try {
      const output = await Promise.race([
        taskFn(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeoutMs)),
      ]);
      return { success: true, output, durationMs: Date.now() - start };
    } catch (err: any) {
      return { success: false, error: err.message, durationMs: Date.now() - start };
    }
  }
}

export const taskRunner = new TaskRunner();
