/**
 * Environment Validation
 * Ensures all required variables and services are present before the app runs.
 * Fails safely with warnings (never crashes the app).
 */

import { getSupabaseUrl, getSupabaseAnonKey, getSupabaseServiceRoleKey } from "@/lib/utils/env";

export interface EnvValidationResult {
  valid: boolean;
  warnings: string[];
  missing: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const warnings: string[] = [];
  const missing: string[] = [];

  const url = getSupabaseUrl();
  const anon = getSupabaseAnonKey();
  const service = getSupabaseServiceRoleKey();

  if (!url) {
    missing.push("VITE_SUPABASE_URL");
    warnings.push("Supabase URL is missing — falling back to mock mode.");
  }

  if (!anon) {
    missing.push("VITE_SUPABASE_ANON_KEY");
    warnings.push("Supabase anon key missing — mock mode will be used.");
  }

  if (!service) {
    warnings.push("SUPABASE_SERVICE_ROLE_KEY not set — admin operations will be limited.");
  }

  const valid = missing.length === 0;

  return {
    valid,
    warnings,
    missing,
  };
}
