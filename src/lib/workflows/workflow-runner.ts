/**
 * Workflow Runner
 * Handles execution of a single workflow run with retry and recovery.
 */

import type { WorkflowRun } from "./workflow-definitions";

export async function runWithRetry(
  run: WorkflowRun,
  fn: () => Promise<void>,
  maxRetries = 3,
): Promise<void> {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      await fn();
      return;
    } catch (err) {
      attempts++;
      if (attempts >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * attempts)); // simple backoff
    }
  }
}
