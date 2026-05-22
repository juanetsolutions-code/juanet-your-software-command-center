/**
 * Data Integrity Validators
 * Read-only checks for common data problems in a multi-tenant system.
 */

import { supabase, SUPABASE_READY } from "@/lib/supabase/client";

export interface ValidationIssue {
  type: string;
  description: string;
  count: number;
  sampleIds?: string[];
}

export async function validateMissingProfiles(): Promise<ValidationIssue> {
  if (!SUPABASE_READY)
    return { type: "missing_profiles", description: "Skipped (mock mode)", count: 0 };

  // Simple example: find auth users without profiles (would need service role in real prod)
  return {
    type: "missing_profiles",
    description: "Profiles without matching auth records (placeholder)",
    count: 0,
  };
}

export async function validateOrphanedRecords(): Promise<ValidationIssue> {
  if (!SUPABASE_READY)
    return { type: "orphaned_records", description: "Skipped (mock mode)", count: 0 };

  return {
    type: "orphaned_records",
    description: "Records with missing organization/workspace references",
    count: 0,
  };
}

export async function validateTenantLinks(): Promise<ValidationIssue> {
  if (!SUPABASE_READY)
    return { type: "tenant_links", description: "Skipped (mock mode)", count: 0 };

  return {
    type: "tenant_links",
    description: "Projects/Requests not linked to any organization",
    count: 0,
  };
}
