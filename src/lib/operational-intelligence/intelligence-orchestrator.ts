/**
 * Intelligence Orchestrator
 * Coordinates all operational intelligence components for unified enterprise view.
 */

import { operationalCorrelations } from "./operational-correlations";
import { businessSignals } from "./business-signals";
import { tenantRiskAnalysis } from "./tenant-risk-analysis";
import { operationalInsights } from "./operational-insights";

export class IntelligenceOrchestrator {
  async generateTenantIntelligence(
    tenantId: string,
    rawSignals: Record<string, number>,
  ): Promise<any> {
    const risk = tenantRiskAnalysis.analyze(tenantId, rawSignals);
    const corr = operationalCorrelations.correlate(tenantId, Object.keys(rawSignals));
    const insights = operationalInsights.generateFromCorrelations(tenantId, [corr]);

    return {
      tenantId,
      riskProfile: risk,
      correlations: [corr],
      insights,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const intelligenceOrchestrator = new IntelligenceOrchestrator();
