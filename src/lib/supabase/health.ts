/**
 * Supabase health & diagnostics.
 * Used for debugging connectivity and missing tables without crashing.
 * No UI surface yet.
 */

import { supabase, SUPABASE_READY } from "./client";
import { logger } from "@/lib/utils/logger";

export interface HealthReport {
  ready: boolean;
  connected: boolean;
  tables: Record<string, boolean>;
  errors: string[];
  timestamp: string;
}

const TABLES_TO_CHECK = ["profiles", "projects", "requests", "messages", "invoices", "payments"];

export async function checkSupabaseConnection(): Promise<HealthReport> {
  const report: HealthReport = {
    ready: SUPABASE_READY,
    connected: false,
    tables: {},
    errors: [],
    timestamp: new Date().toISOString(),
  };

  if (!SUPABASE_READY) {
    logger.info("[Health] Supabase not configured — mock mode active");
    return report;
  }

  try {
    // Lightweight ping
    const { error: pingErr } = await supabase.from("profiles").select("id").limit(1);
    if (pingErr) {
      report.errors.push(`ping failed: ${pingErr.message}`);
    } else {
      report.connected = true;
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    report.errors.push(`connection error: ${msg}`);
  }

  // Check individual tables (non-fatal)
  for (const table of TABLES_TO_CHECK) {
    try {
      const { error } = await supabase.from(table).select("id").limit(1);
      report.tables[table] = !error;
      if (error) {
        report.errors.push(`${table}: ${error.message}`);
      }
    } catch (e: unknown) {
      report.tables[table] = false;
      const msg = e instanceof Error ? e.message : String(e);
      report.errors.push(`${table}: ${msg}`);
    }
  }

  logger.info("[Health] Supabase report", report);
  return report;
}

export function isMockMode(): boolean {
  return !SUPABASE_READY;
}

export async function detectMissingTables(): Promise<string[]> {
  const report = await checkSupabaseConnection();
  return Object.keys(report.tables).filter((t) => !report.tables[t]);
}
