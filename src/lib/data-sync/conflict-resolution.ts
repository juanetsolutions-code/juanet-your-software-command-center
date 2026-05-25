/**
 * Data Synchronization Engine - Conflict Resolution
 * Handles conflicts that arise during bi-directional synchronization.
 */

export type ConflictResolutionStrategy = "last_write_wins" | "source_wins" | "manual" | "merge";

export interface Conflict {
  id: string;
  tenantId: string;
  syncJobId: string;
  entityType: string;
  externalId: string;
  localData: any;
  externalData: any;
  detectedAt: string;
  resolved: boolean;
}

export class ConflictResolution {
  private conflicts: Conflict[] = [];

  detectConflict(
    syncJobId: string,
    tenantId: string,
    entityType: string,
    externalId: string,
    localData: any,
    externalData: any,
  ): Conflict | null {
    // Simple deep equality check (in production: more sophisticated diffing)
    if (JSON.stringify(localData) === JSON.stringify(externalData)) {
      return null;
    }

    const conflict: Conflict = {
      id: `conflict_${Date.now()}`,
      tenantId,
      syncJobId,
      entityType,
      externalId,
      localData,
      externalData,
      detectedAt: new Date().toISOString(),
      resolved: false,
    };

    this.conflicts.push(conflict);
    return conflict;
  }

  resolveConflict(
    conflictId: string,
    strategy: ConflictResolutionStrategy,
    resolutionData?: any,
  ): void {
    const conflict = this.conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    conflict.resolved = true;
    // In real system: apply the chosen strategy and push the resolved data back to both sides
    console.log(`[DataSync] Conflict ${conflictId} resolved using strategy: ${strategy}`);
  }
}

export const conflictResolution = new ConflictResolution();
