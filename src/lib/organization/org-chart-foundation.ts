/**
 * Enterprise Organizational Structure Infrastructure
 * Foundation for future org chart visualization and rendering.
 */

import type { OrganizationHierarchy } from "./organization-types";

export class OrgChartFoundation {
  exportToJson(hierarchy: OrganizationHierarchy[]): any {
    return hierarchy.map((h) => ({
      id: h.root.id,
      name: h.root.name,
      type: h.root.type,
      children: h.children.map((c) => c.root.name),
    }));
  }

  // Placeholder for future tree flattening, level calculation, etc.
  calculateLevels(hierarchy: OrganizationHierarchy): number {
    return 1;
  }
}

export const orgChartFoundation = new OrgChartFoundation();
