/**
 * Enterprise Organizational Structure Infrastructure
 * Core service for managing organizations with full tenant isolation.
 */

import type { Organization, OrganizationHierarchy } from "./organization-types";

export class OrganizationService {
  private organizations: Organization[] = [];

  createOrganization(tenantId: string, name: string, parentId?: string): Organization {
    const org: Organization = {
      id: `org_${Date.now()}`,
      tenantId,
      name,
      parentId,
      type: "company",
      createdAt: new Date().toISOString(),
    };
    this.organizations.push(org);
    return org;
  }

  getOrganizationById(id: string, tenantId: string): Organization | undefined {
    return this.organizations.find((o) => o.id === id && o.tenantId === tenantId);
  }

  getHierarchy(tenantId: string): OrganizationHierarchy[] {
    // Stub implementation - returns flat structure for now
    const tenantOrgs = this.organizations.filter((o) => o.tenantId === tenantId);
    return tenantOrgs.map((org) => ({
      root: org,
      children: [],
      departments: [],
    }));
  }
}

export const organizationService = new OrganizationService();
