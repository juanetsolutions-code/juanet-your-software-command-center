export type DependencyStatus = "healthy" | "degraded" | "down" | "unknown";

export type DependencyCheck = {
  name: string;
  status: DependencyStatus;
  latencyMs?: number;
  error?: string;
  lastChecked: string;
};

class DependencyMonitor {
  private dependencies: Map<string, DependencyCheck> = new Map();
  private checks: Map<string, () => Promise<DependencyStatus>> = new Map();

  register(name: string, check: () => Promise<DependencyStatus>): void {
    this.checks.set(name, check);
  }

  async check(name: string): Promise<DependencyCheck> {
    const checker = this.checks.get(name);
    const start = Date.now();

    const check: DependencyCheck = {
      name,
      status: "unknown",
      lastChecked: new Date().toISOString(),
    };

    if (!checker) {
      check.status = "unknown";
      this.dependencies.set(name, check);
      return check;
    }

    try {
      check.status = await checker();
      check.latencyMs = Date.now() - start;
    } catch (error) {
      check.status = "down";
      check.error = error instanceof Error ? error.message : String(error);
    }

    this.dependencies.set(name, check);
    return check;
  }

  async checkAll(): Promise<DependencyCheck[]> {
    const results: DependencyCheck[] = [];
    for (const name of this.checks.keys()) {
      results.push(await this.check(name));
    }
    return results;
  }

  getStatus(name: string): DependencyCheck | undefined {
    return this.dependencies.get(name);
  }

  getAll(): DependencyCheck[] {
    return Array.from(this.dependencies.values());
  }
}

export const dependencyMonitor = new DependencyMonitor();

export function registerDependency(name: string, check: () => Promise<DependencyStatus>): void {
  dependencyMonitor.register(name, check);
}

export function checkDependency(name: string): Promise<DependencyCheck> {
  return dependencyMonitor.check(name);
}

export function checkAllDependencies(): Promise<DependencyCheck[]> {
  return dependencyMonitor.checkAll();
}