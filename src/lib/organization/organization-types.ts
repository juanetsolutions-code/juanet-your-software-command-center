/**
 * Enterprise Organizational Structure Infrastructure
 * Core types for multi-level hierarchies, departments, and reporting chains.
 */

export interface Organization {
  id: string;
  tenantId: string;
  name: string;
  parentId?: string;
  type: "company" | "division" | "department" | "team";
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Department {
  id: string;
  tenantId: string;
  organizationId: string;
  name: string;
  managerId?: string;
  parentDepartmentId?: string;
  level: number;
}

export interface ReportingStructure {
  userId: string;
  tenantId: string;
  managerId?: string;
  directReports: string[];
  organizationId: string;
  departmentId?: string;
}

export interface OrganizationHierarchy {
  root: Organization;
  children: OrganizationHierarchy[];
  departments: Department[];
}
