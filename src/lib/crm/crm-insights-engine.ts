import { DealScoringEngine } from "./analytics/deal-score-model";
import { PipelineHealthAnalyzer } from "./analytics/pipeline-health";
import { LeadsPriorityEngine } from "./leads/lead-priority-engine";

export type CrmInsight = {
  type: "deal_stalled" | "deal_hot" | "pipeline_bottleneck" | "revenue_forecast" | "upgrade_opportunity";
  entityType: "deal" | "lead" | "pipeline";
  entityId?: string;
  tenantId: string;
  message: string;
  confidence: number;
  suggestedAction?: string;
};

export class CrmInsightsEngine {
  private dealScorer = new DealScoringEngine();
  private healthAnalyzer = new PipelineHealthAnalyzer();
  private priorityEngine = new LeadsPriorityEngine();

  async generateInsights(tenantId: string): Promise<CrmInsight[]> {
    const insights: CrmInsight[] = [];

    insights.push(...await this.getDealInsights(tenantId));
    insights.push(...await this.getPipelineInsights(tenantId));

    return insights;
  }

  private async getDealInsights(tenantId: string): Promise<CrmInsight[]> {
    const { dealService } = await import("./services/deal-service");
    const deals = await dealService.list(tenantId);

    return deals
      .filter((deal) => deal.stage !== "closed_won" && deal.stage !== "closed_lost")
      .map((deal) => {
        const score = this.dealScorer.score(deal);

        if (!deal.updatedAt) return null;
        const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

        if (days > 12) {
          return {
            type: "deal_stalled" as const,
            entityType: "deal" as const,
            entityId: deal.id,
            tenantId,
            message: `Deal "${deal.name}" has been inactive for ${days} days`,
            confidence: 0.9,
            suggestedAction: "follow_up",
          };
        }

        if (score.probability > 80) {
          return {
            type: "deal_hot" as const,
            entityType: "deal" as const,
            entityId: deal.id,
            tenantId,
            message: `Deal "${deal.name}" has high conversion probability (${score.probability}%)`,
            confidence: 0.85,
            suggestedAction: "schedule_closing_call",
          };
        }

        return null;
      })
      .filter((insight): insight is CrmInsight => insight !== null);
  }

  private async getPipelineInsights(tenantId: string): Promise<CrmInsight[]> {
    const health = await this.healthAnalyzer.analyze(tenantId);

    const insights: CrmInsight[] = [];

    for (const bottleneck of health.bottlenecks) {
      insights.push({
        type: "pipeline_bottleneck" as const,
        entityType: "pipeline" as const,
        tenantId,
        message: bottleneck,
        confidence: 0.8,
        suggestedAction: "review_process",
      });
    }

    return insights;
  }
}