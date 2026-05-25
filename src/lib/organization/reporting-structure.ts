/**
 * Enterprise Organizational Structure Infrastructure
 * Reporting structure management for users and departments.
 */

import type { ReportingStructure } from "./organization-types";

export class ReportingStructureManager {
  private structures: ReportingStructure[] = [];

  setReportingLine(
    userId: string,
    managerId: string | undefined,
    tenantId: string,
    organizationId: string,
    departmentId?: string,
  ): ReportingStructure {
    const structure: ReportingStructure = {
      userId,
      tenantId,
      managerId,
      directReports: [],
      organizationId,
      departmentId,
    };
    this.structures = this.structures.filter(
      (s) => !(s.userId === userId && s.tenantId === tenantId),
    );
    this.structures.push(structure);
    return structure;
  }

  getDirectReports(managerId: string, tenantId: string): ReportingStructure[] {
    return this.structures.filter((s) => s.managerId === managerId && s.tenantId === tenantId);
  }
}

export const reportingStructureManager = new ReportingStructureManager();
