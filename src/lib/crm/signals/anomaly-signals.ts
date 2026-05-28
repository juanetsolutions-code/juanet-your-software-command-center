import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type Anomaly = {
  id: string;
  type: "pipeline_drop" | "conversion_anomaly" | "deal_velocity_change" | "lead_quality_change";
  metric: string;
  currentValue: number;
  baseline?: number;
  deviation: number;
  detectedAt: string;
};

export class AnomalySignals {
  detectPipelineTrend(deals: Deal[], baseline: number): Anomaly | null {
    const active = deals.filter(d => d.stage !== "closed_won" && d.stage !== "closed_lost").length;
    const deviation = Math.abs(active - baseline) / (baseline || 1);
    
    if (deviation > 0.3) {
      return {
        id: `anom_${Date.now()}`,
        type: "pipeline_drop",
        metric: "active_deals_count",
        currentValue: active,
        baseline,
        deviation,
        detectedAt: new Date().toISOString(),
      };
    }
    
    return null;
  }
}

export const anomalySignals = new AnomalySignals();