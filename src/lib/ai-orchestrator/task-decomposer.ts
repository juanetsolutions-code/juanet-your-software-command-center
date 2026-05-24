/**
 * Task Decomposer - Breaks down high-level tasks.
 */

export function decomposeTask(task: string): string[] {
  // Simple decomposition
  return task.split('.').map(s => s.trim()).filter(Boolean);
}
