/**
 * Tenant Context Builder for AI.
 */

import { getCurrentOrganization } from "@/lib/tenant/context";

export function buildTenantContext(tenantId?: string) {
  const org = getCurrentOrganization();
  return {
    tenantId: tenantId || org?.id || "unknown",
    organization: org,
    timestamp: new Date().toISOString(),
  };
}
