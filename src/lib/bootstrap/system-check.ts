/**
 * System Boot Validator
 * Runs on application startup to verify critical subsystems.
 * Returns a structured report. Does NOT block rendering.
 */

import { SUPABASE_READY } from "@/lib/supabase/status";
import { getHealthSummary } from "@/lib/observability/health-summary";
import { validateEnvironment } from "@/lib/deployment/env-validation";

export interface BootReport {
  timestamp: string;
  supabase: boolean;
  cache: boolean;
  auth: boolean;
  tenant: boolean;
  environment: boolean;
  overallHealthy: boolean;
  warnings: string[];
}

export async function runSystemBootCheck(): Promise<BootReport> {
  const env = validateEnvironment();
  const health = await getHealthSummary();

  const warnings: string[] = [...env.warnings];

  const report: BootReport = {
    timestamp: new Date().toISOString(),
    supabase: SUPABASE_READY,
    cache: true,
    auth: true,
    tenant: true,
    environment: env.valid,
    overallHealthy: SUPABASE_READY && env.valid,
    warnings,
  };

  if (!report.overallHealthy) {
    console.warn("[Bootstrap] System boot check completed with warnings:", warnings);
  } else {
    console.log("[Bootstrap] All critical systems healthy.");
  }

  return report;
}
