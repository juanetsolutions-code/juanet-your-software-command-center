/**
 * Memory Governance
 * Tenant-safe boundaries, compliance, audit, and access control for all memory layers.
 */

export interface MemoryAccessLog {
  memoryId: string;
  tenantId: string;
  accessor: string;
  operation: "read" | "write" | "consolidate" | "forget";
  timestamp: string;
  approved: boolean;
}

export class MemoryGovernance {
  private accessLogs: MemoryAccessLog[] = [];

  enforceTenantBoundary(requestingTenant: string, targetTenant: string): boolean {
    const allowed = requestingTenant === targetTenant;
    if (!allowed) {
      console.warn(
        `[MemoryGovernance] Cross-tenant access denied: ${requestingTenant} -> ${targetTenant}`,
      );
    }
    return allowed;
  }

  logAccess(log: Omit<MemoryAccessLog, "timestamp">): void {
    this.accessLogs.push({ ...log, timestamp: new Date().toISOString() });
  }

  getAccessAudit(tenantId: string): MemoryAccessLog[] {
    return this.accessLogs.filter((l) => l.tenantId === tenantId);
  }
}

export const memoryGovernance = new MemoryGovernance();
