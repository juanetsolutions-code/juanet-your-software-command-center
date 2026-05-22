/**
 * Progressive Migration Bridge
 *
 * Allows safe switching between data modes:
 * - mock     : fully mock (current default for UI stability)
 * - hybrid   : real mutations + mock reads (for gradual rollout)
 * - full     : everything real via Supabase + facade
 *
 * Controlled by feature flags or env.
 */

import { SUPABASE_READY } from "@/lib/supabase/status";

export type DataMode = "mock" | "hybrid" | "full";

export function getCurrentDataMode(): DataMode {
  const envMode = (import.meta.env.VITE_DATA_MODE as DataMode) || "mock";

  if (!SUPABASE_READY) return "mock";

  if (envMode === "full") return "full";
  if (envMode === "hybrid") return "hybrid";

  return "mock";
}

export const migrationBridge = {
  mode: getCurrentDataMode(),

  isMockMode() {
    return this.mode === "mock";
  },

  isHybridMode() {
    return this.mode === "hybrid";
  },

  isFullMode() {
    return this.mode === "full";
  },

  shouldUseRealData() {
    return this.mode !== "mock";
  },
};

export default migrationBridge;
