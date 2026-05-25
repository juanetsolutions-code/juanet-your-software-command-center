/**
 * Execution Profiler
 * Profiles function and request execution times for bottleneck identification.
 */

export interface ProfileResult {
  name: string;
  durationMs: number;
  tenantId?: string;
  timestamp: string;
}

export class ExecutionProfiler {
  private profiles: ProfileResult[] = [];

  profile<T>(name: string, fn: () => T, tenantId?: string): T {
    const start = Date.now();
    const result = fn();
    const duration = Date.now() - start;
    this.profiles.push({
      name,
      durationMs: duration,
      tenantId,
      timestamp: new Date().toISOString(),
    });
    return result;
  }
}

export const executionProfiler = new ExecutionProfiler();
