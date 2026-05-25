/**
 * Executive Analytics
 * Aggregates all executive intelligence signals into structured analytical outputs.
 */

import type { BusinessInsight } from "./business-insights";
import type { OperationalKPI } from "./operational-kpis";

export interface ExecutiveAnalyticsReport {
  tenantId: string;
  generatedAt: string;
  healthScore: number;
  businessInsights: BusinessInsight[];
  operationalHealth: OperationalKPI[];
  strategicOutlook: string;
  priorityActions: string[];
}

export class ExecutiveAnalytics {
  compileReport(
    tenantId: string,
    insights: BusinessInsight[],
    kpis: OperationalKPI[],
  ): ExecutiveAnalyticsReport {
    const health = kpis.filter((k) => k.status === "on_track").length / Math.max(1, kpis.length);

    return {
      tenantId,
      generatedAt: new Date().toISOString(),
      healthScore: Math.round(health * 100) / 100,
      businessInsights: insights,
      operationalHealth: kpis,
      strategicOutlook: health > 0.8 ? "Strong" : "Monitor closely",
      priorityActions: health < 0.7 ? ["Review cost drivers", "Accelerate adoption"] : [],
    };
  }
}

export const executiveAnalytics = new ExecutiveAnalytics();
