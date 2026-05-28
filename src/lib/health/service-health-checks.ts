import type { HealthCheckResult, HealthStatus } from "./system-health";

type ServiceCheck = {
  name: string;
  check: () => Promise<HealthStatus>;
  timeoutMs?: number;
};

class ServiceHealthChecker {
  private services: ServiceCheck[] = [];
  private lastResults: Map<string, HealthCheckResult> = new Map();

  register(name: string, check: () => Promise<HealthStatus>, timeoutMs = 5000): void {
    this.services.push({ name, check, timeoutMs });
  }

  async checkService(name: string): Promise<HealthCheckResult> {
    const service = this.services.find((s) => s.name === name);
    if (!service) {
      return {
        status: "unknown",
        component: name,
        message: "Service not registered",
        timestamp: new Date().toISOString(),
      };
    }

    const start = Date.now();
    try {
      const timeoutPromise = new Promise<HealthStatus>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout")), service.timeoutMs);
      });
      
      const status = await Promise.race([service.check(), timeoutPromise]);
      
      const result: HealthCheckResult = {
        status,
        component: name,
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
      
      this.lastResults.set(name, result);
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        status: "unhealthy",
        component: name,
        message: error instanceof Error ? error.message : String(error),
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
      
      this.lastResults.set(name, result);
      return result;
    }
  }

  async checkAll(): Promise<HealthCheckResult[]> {
    return Promise.all(this.services.map((s) => this.checkService(s.name)));
  }

  getLastResult(name: string): HealthCheckResult | undefined {
    return this.lastResults.get(name);
  }
}

export const serviceHealth = new ServiceHealthChecker();

export function registerServiceHealth(
  name: string,
  check: () => Promise<HealthStatus>,
  timeoutMs?: number
): void {
  serviceHealth.register(name, check, timeoutMs);
}

export function checkServiceHealth(name: string): Promise<HealthCheckResult> {
  return serviceHealth.checkService(name);
}

export function checkAllServices(): Promise<HealthCheckResult[]> {
  return serviceHealth.checkAll();
}