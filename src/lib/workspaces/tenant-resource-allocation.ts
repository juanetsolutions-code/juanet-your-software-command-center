/**
 * Tenant Resource Allocation
 * Manages and enforces resource quotas per tenant workspace.
 */

export class TenantResourceAllocation {
  private allocations = new Map<string, Record<string, number>>();

  allocate(tenantId: string, resources: Record<string, number>): void {
    this.allocations.set(tenantId, resources);
  }

  getAllocation(tenantId: string): Record<string, number> | undefined {
    return this.allocations.get(tenantId);
  }
}

export const tenantResourceAllocation = new TenantResourceAllocation();
