import type { SystemSnapshot, DiagnosticContext } from "./diagnostic-runner";

export type SystemSnapshotResult = {
  snapshot: SystemSnapshot;
  context?: DiagnosticContext;
};

class SystemSnapshotGenerator {
  private snapshots: SystemSnapshot[] = [];

  create(type: "full" | "quick" | "tenant", tenantId?: string): Promise<SystemSnapshot> {
    return Promise.resolve({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV ?? "mock",
      version: process.env.npm_package_version ?? "0.0.0",
      health: {
        overall: "healthy",
        score: 100,
        timestamp: new Date().toISOString(),
        checks: [],
      },
      services: {},
      metrics: {
        uptime: process.uptime() * 1000,
        memory: process.memoryUsage().heapUsed,
      },
      recentEvents: [],
      configuration: {
        nodeEnv: process.env.NODE_ENV,
        snapshotType: type,
        tenantId,
      },
    });
  }

  async export(format: "json" | "zip"): Promise<string | Buffer> {
    const snapshot = await this.create("quick");
    
    if (format === "json") {
      return JSON.stringify(snapshot, null, 2);
    }

    return Buffer.from(JSON.stringify(snapshot));
  }

  addSnapshot(snapshot: SystemSnapshot): void {
    this.snapshots.push(snapshot);
  }

  getHistory(limit?: number): SystemSnapshot[] {
    const history = [...this.snapshots].reverse();
    return limit ? history.slice(0, limit) : history;
  }
}

export const systemSnapshot = new SystemSnapshotGenerator();

export async function createSystemSnapshot(type: "full" | "quick" | "tenant", tenantId?: string): Promise<SystemSnapshot> {
  return systemSnapshot.create(type, tenantId);
}

export async function exportDiagnostics(format: "json" | "zip"): Promise<string | Buffer> {
  return systemSnapshot.export(format);
}