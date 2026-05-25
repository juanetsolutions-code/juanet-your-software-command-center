/**
 * Data Synchronization Engine - Sync Health
 * Monitors the health and performance of synchronization jobs.
 */

export interface SyncHealthStatus {
  syncJobId: string;
  tenantId: string;
  status: "healthy" | "degraded" | "failing";
  lastSuccessfulSync?: string;
  consecutiveFailures: number;
  averageDurationMs: number;
}

export class SyncHealth {
  private healthRecords: Map<string, SyncHealthStatus> = new Map();

  updateHealth(syncJobId: string, tenantId: string, success: boolean, durationMs?: number): void {
    let record = this.healthRecords.get(syncJobId);

    if (!record) {
      record = {
        syncJobId,
        tenantId,
        status: "healthy",
        consecutiveFailures: 0,
        averageDurationMs: 0,
      };
      this.healthRecords.set(syncJobId, record);
    }

    if (success) {
      record.consecutiveFailures = 0;
      record.lastSuccessfulSync = new Date().toISOString();
      record.status = "healthy";
    } else {
      record.consecutiveFailures++;
      if (record.consecutiveFailures >= 3) {
        record.status = "failing";
      } else {
        record.status = "degraded";
      }
    }

    if (durationMs) {
      // Simple moving average
      record.averageDurationMs =
        record.averageDurationMs === 0
          ? durationMs
          : record.averageDurationMs * 0.7 + durationMs * 0.3;
    }
  }

  getHealth(syncJobId: string): SyncHealthStatus | undefined {
    return this.healthRecords.get(syncJobId);
  }
}

export const syncHealth = new SyncHealth();
