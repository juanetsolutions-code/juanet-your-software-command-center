/**
 * Enterprise Organizational Structure Infrastructure
 * Department management with hierarchy and reporting support.
 */

import type { Department } from "./organization-types";

export class DepartmentManager {
  private departments: Department[] = [];

  createDepartment(
    tenantId: string,
    organizationId: string,
    name: string,
    parentDepartmentId?: string,
  ): Department {
    const dept: Department = {
      id: `dept_${Date.now()}`,
      tenantId,
      organizationId,
      name,
      parentDepartmentId,
      level: parentDepartmentId ? 2 : 1,
    };
    this.departments.push(dept);
    return dept;
  }

  getDepartmentsByOrganization(organizationId: string, tenantId: string): Department[] {
    return this.departments.filter(
      (d) => d.organizationId === organizationId && d.tenantId === tenantId,
    );
  }
}

export const departmentManager = new DepartmentManager();
