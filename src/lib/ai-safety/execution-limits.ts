/**
 * Execution Limits to prevent abuse.
 */

export const AI_LIMITS = {
  maxToolCallsPerTask: 10,
  maxDecisionsPerMinute: 5,
  maxConcurrentAgentsPerTenant: 3,
};

export function withinLimits(current: number, limit: number): boolean {
  return current < limit;
}
