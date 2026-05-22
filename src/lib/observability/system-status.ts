/**
 * System Status
 * High-level structured status report for deployment, monitoring, and ops.
 * Completely decoupled from any UI.
 */

import { getHealthSummary } from "./health-summary";
import { getPerformanceSummary } from "@/lib/monitoring/performance";
import { SUPABASE_READY } from "@/lib/supabase/status";

export interface SystemStatus {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: string;
  components: {
    supabase: boolean;
    cache: boolean;
    auth: boolean;
    repositories: boolean;
    jobs: boolean;
  };
  health: Awaited<ReturnType<typeof getHealthSummary>>;
  performance: ReturnType<typeof getPerformanceSummary>;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const health = await getHealthSummary();
  const perf = getPerformanceSummary();

  const status: SystemStatus = {
    status:
      health.overall === "healthy" ? "ok" : health.overall === "degraded" ? "degraded" : "down",
    version: "1.0.0-hardening",
    timestamp: new Date().toISOString(),
    components: {
      supabase: SUPABASE_READY,
      cache: true, // always available (in-memory)
      auth: true,
      repositories: true,
      jobs: true, // jobs layer exists even if empty
    },
    health,
    performance: perf,
  };

  return status;
}
