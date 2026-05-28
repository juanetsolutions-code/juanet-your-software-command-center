import type { HealthSnapshot, HealthCheckResult } from "../health/system-health";

export type SystemSnapshot = {
  timestamp: string;
  environment: string;
  version: string;
  health: HealthSnapshot;
  services: Record<string, HealthCheckResult>;
  metrics: Record<string, number>;
  recentEvents: Array<{ type: string; timestamp: string }>;
  configuration: Record<string, unknown>;
};

export type DiagnosticContext = {
  requestId?: string;
  tenantId?: string;
  startTime: number;
  operations: Array<{ name: string; duration: number; status: "success" | "error" }>;
};

class DiagnosticRunner {
  private snapshotHistory: SystemSnapshot[] = [];
  private contextMap: Map<string, DiagnosticContext> = new Map();

  async generateSnapshot(health: HealthSnapshot, additional?: Partial<SystemSnapshot>): Promise<SystemSnapshot> {
    const snapshot: SystemSnapshot = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "mock",
      version: process.env.npm_package_version ?? "0.0.0",
      health,
      services: {},
      metrics: {},
      recentEvents: [],
      configuration: {},
      ...additional,
    };

    this.snapshotHistory.push(snapshot);
    return snapshot;
  }

  startContext(requestId: string, tenantId?: string): DiagnosticContext {
    const context: DiagnosticContext = {
      requestId,
      tenantId,
      startTime: Date.now(),
      operations: [],
    };
    this.contextMap.set(requestId, context);
    return context;
  }

  endContext(requestId: string): DiagnosticContext | undefined {
    const context = this.contextMap.get(requestId);
    if (context && context.operations.length > 0) {
      const lastOp = context.operations[context.operations.length - 1];
      if (!lastOp.endTime) {
        lastOp.duration = Date.now() - (lastOp.startTime ?? Date.now());
      }
    }
    return context;
  }

  recordOperation(requestId: string, name: string, status: "success" | "error"): void {
    const context = this.contextMap.get(requestId);
    if (context) {
      context.operations.push({ name, duration: Date.now(), status });
    }
  }

  getContext(requestId: string): DiagnosticContext | undefined {
    return this.contextMap.get(requestId);
  }

  getHistory(limit?: number): SystemSnapshot[] {
    const history = [...this.snapshotHistory].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  clearHistory(): void {
    this.snapshotHistory = [];
  }
}

export const diagnosticRunner = new DiagnosticRunner();

export function startDiagnostics(requestId: string, tenantId?: string): DiagnosticContext {
  return diagnosticRunner.startContext(requestId, tenantId);
}

export function recordDiagnosticOperation(
  requestId: string,
  name: string,
  status: "success" | "error"
): void {
  diagnosticRunner.recordOperation(requestId, name, status);
}

export function generateDiagnosticSnapshot(
  health: HealthSnapshot,
  additional?: Partial<SystemSnapshot>
): Promise<SystemSnapshot> {
  return diagnosticRunner.generateSnapshot(health, additional);
}