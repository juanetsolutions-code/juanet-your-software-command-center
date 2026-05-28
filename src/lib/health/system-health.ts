export type HealthStatus = "healthy" | "degraded" | "unhealthy" | "unknown";

export type HealthCheckResult = {
  status: HealthStatus;
  component: string;
  message?: string;
  details?: Record<string, unknown>;
  durationMs?: number;
  timestamp: string;
};

export type HealthSnapshot = {
  overall: HealthStatus;
  score: number;
  timestamp: string;
  checks: HealthCheckResult[];
};

class HealthRegistry {
  private checks: Array<() => Promise<HealthCheckResult>> = [];
  private lastSnapshot?: HealthSnapshot;

  registerCheck(check: () => Promise<HealthCheckResult>): void {
    this.checks.push(check);
  }

  unregisterCheck(check: () => Promise<HealthCheckResult>): void {
    const index = this.checks.indexOf(check);
    if (index > -1) {
      this.checks.splice(index, 1);
    }
  }

  async runChecks(): Promise<HealthSnapshot> {
    const results: HealthCheckResult[] = [];

    for (const check of this.checks) {
      try {
        const result = await check();
        results.push(result);
      } catch (error) {
        results.push({
          status: "unhealthy",
          component: "unknown",
          message: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString(),
        });
      }
    }

    const score = this.calculateScore(results);
    const overall = this.determineOverallStatus(results, score);

    const snapshot: HealthSnapshot = {
      overall,
      score,
      timestamp: new Date().toISOString(),
      checks: results,
    };

    this.lastSnapshot = snapshot;
    return snapshot;
  }

  getLastSnapshot(): HealthSnapshot | undefined {
    return this.lastSnapshot;
  }

  private calculateScore(checks: HealthCheckResult[]): number {
    if (checks.length === 0) return 100;

    const statusValues: Record<HealthStatus, number> = {
      healthy: 100,
      degraded: 50,
      unhealthy: 0,
      unknown: 25,
    };

    const total = checks.reduce((sum, check) => sum + statusValues[check.status], 0);
    return Math.round(total / checks.length);
  }

  private determineOverallStatus(checks: HealthCheckResult[], score: number): HealthStatus {
    if (checks.some((c) => c.status === "unhealthy")) {
      return "unhealthy";
    }
    if (checks.some((c) => c.status === "degraded") || score < 70) {
      return "degraded";
    }
    if (checks.some((c) => c.status === "unknown")) {
      return "unknown";
    }
    return "healthy";
  }
}

export const healthRegistry = new HealthRegistry();

export function registerHealthCheck(check: () => Promise<HealthCheckResult>): void {
  healthRegistry.registerCheck(check);
}

export function getSystemHealth(): Promise<HealthSnapshot> {
  return healthRegistry.runChecks();
}

export function getLastHealthSnapshot(): HealthSnapshot | undefined {
  return healthRegistry.getLastSnapshot();
}