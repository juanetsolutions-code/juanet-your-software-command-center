/**
 * Failure Guard - Prevents runaway workflows.
 */

export function guardExecution(attempts: number, maxRetries = 3): boolean {
  return attempts <= maxRetries;
}
