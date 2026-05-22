/**
 * Health Summary
 * Aggregates the health of core subsystems (DB, cache, auth, repos, etc.)
 * Returns plain JSON-safe data — no UI coupling.
 */

import { SUPABASE_READY } from "@/lib/supabase/status";
import { getCacheStats } from "@/lib/monitoring/performance";
import { getRecentErrors } from "@/lib/monitoring/error-tracker";

export interface HealthSummary {
  timestamp: string;
  supabase: {
    configured: boolean;
    healthy: boolean;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: string;
  };
  errors: {
    recentCount: number;
    lastError?: string;
  };
  overall: "healthy" | "degraded" | "unhealthy";
}

export async function getHealthSummary(): Promise<HealthSummary> {
  const cacheStats = getCacheStats();
  const recentErrors = getRecentErrors(5);

  const supabaseHealthy = SUPABASE_READY; // In real prod this would ping the DB

  const errorCount = recentErrors.length;
  let overall: HealthSummary["overall"] = "healthy";

  if (!supabaseHealthy) overall = "unhealthy";
  else if (errorCount > 3) overall = "degraded";

  return {
    timestamp: new Date().toISOString(),
    supabase: {
      configured: SUPABASE_READY,
      healthy: supabaseHealthy,
    },
    cache: {
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hitRate,
    },
    errors: {
      recentCount: errorCount,
      lastError:
        recentErrors.length > 0 ? recentErrors[recentErrors.length - 1].message : undefined,
    },
    overall,
  };
}
