/**
 * Feature Flag Governance
 * Supports:
 * - Global defaults
 * - Role-based overrides
 * - Tenant-level overrides
 * - Safe fallbacks
 */

import { readSession } from "@/lib/auth/store";
import { getCurrentOrganization } from "@/lib/tenant/context";

type FeatureKey =
  | "realtime_messages"
  | "advanced_analytics"
  | "invoice_pdf_export"
  | "team_workspaces"
  | "ai_assistant";

const DEFAULTS: Record<FeatureKey, boolean> = {
  realtime_messages: true,
  advanced_analytics: false,
  invoice_pdf_export: true,
  team_workspaces: true,
  ai_assistant: false,
};

// Role overrides (higher roles can force-enable)
const ROLE_OVERRIDES: Partial<Record<FeatureKey, string[]>> = {
  advanced_analytics: ["admin", "superadmin"],
  ai_assistant: ["superadmin"],
};

// Tenant overrides (stored in memory for now — would come from DB in prod)
const tenantOverrides = new Map<string, Partial<Record<FeatureKey, boolean>>>();

export function isFeatureEnabled(key: FeatureKey, tenantId?: string | null): boolean {
  const session = readSession();
  const role = session?.user?.role ?? "client";
  const org = tenantId ?? getCurrentOrganization()?.id ?? null;

  // 1. Tenant override (highest priority)
  if (org && tenantOverrides.has(org)) {
    const tOverride = tenantOverrides.get(org)!;
    if (key in tOverride) return !!tOverride[key];
  }

  // 2. Role override
  if (ROLE_OVERRIDES[key]?.includes(role)) {
    return true;
  }

  // 3. Default
  return DEFAULTS[key] ?? false;
}

export function setTenantOverride(
  tenantId: string,
  overrides: Partial<Record<FeatureKey, boolean>>,
) {
  tenantOverrides.set(tenantId, overrides);
}

export function getAllFlags() {
  return { ...DEFAULTS };
}
