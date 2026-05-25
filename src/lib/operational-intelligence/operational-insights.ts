/**
 * Operational Insights
 * Generates actionable insights from cross-system operational data.
 */

import type { OperationalCorrelation } from "./operational-correlations";

export interface OperationalInsight {
  id: string;
  tenantId: string;
  category: string;
  description: string;
  severity: number;
  supportingData: Record<string, any>;
  timestamp: string;
}

export class OperationalInsights {
  generateFromCorrelations(
    tenantId: string,
    correlations: OperationalCorrelation[],
  ): OperationalInsight[] {
    return correlations.map((c) => ({
      id: `insight-${c.id}`,
      tenantId,
      category: "correlation",
      description: c.insight,
      severity: c.correlationScore,
      supportingData: { signals: c.signals },
      timestamp: new Date().toISOString(),
    }));
  }
}

export const operationalInsights = new OperationalInsights();
