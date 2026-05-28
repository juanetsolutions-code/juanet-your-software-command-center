import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";
import { leadScoringAI } from "./lead-scoring-ai";
import { dealInsights } from "./deal-insights";
import { pipelineService } from "../services/pipeline-service";

export type CrmRecommendation = {
  type: "lead_action" | "deal_action" | "pipeline_action";
  entityId: string;
  priority: "high" | "medium" | "low";
  message: string;
  action: string;
};

export class CrmRecommendations {
  async getLeadRecommendations(leadId: string, lead: Lead): Promise<CrmRecommendation[]> {
    const recommendations: CrmRecommendation[] = [];

    if (!lead.assignedTo) {
      recommendations.push({
        type: "lead_action",
        entityId: leadId,
        priority: "high",
        message: "Assign this lead to a team member",
        action: "assign_lead",
      });
    }

    if (lead.status === "new") {
      recommendations.push({
        type: "lead_action",
        entityId: leadId,
        priority: "high",
        message: "Qualify this new lead",
        action: "qualify_lead",
      });
    }

    if (lead.score && lead.score < 50) {
      recommendations.push({
        type: "lead_action",
        entityId: leadId,
        priority: "medium",
        message: "Lead score is low - consider additional outreach",
        action: "reassess_lead",
      });
    }

    const analysis = await leadScoringAI.analyze(lead);
    if (analysis.recommendations.length > 0) {
      recommendations.push({
        type: "lead_action",
        entityId: leadId,
        priority: "medium",
        message: analysis.recommendations[0],
        action: "view_lead",
      });
    }

    return recommendations;
  }

  async getDealRecommendations(deals: Deal[]): Promise<CrmRecommendation[]> {
    const recommendations: CrmRecommendation[] = [];
    const pipelines = await pipelineService.getByTenant("");

    for (const deal of deals) {
      if (deal.stage === "closed_won" || deal.stage === "closed_lost") continue;

      const pipeline = pipelines.find((p) => p.id === deal.pipelineId);
      if (pipeline) {
        try {
          const insight = await dealInsights.analyze(deal, pipeline);
          if (insight.riskLevel === "high") {
            recommendations.push({
              type: "deal_action",
              entityId: deal.id,
              priority: "high",
              message: "High risk deal - immediate attention required",
              action: "review_deal",
            });
          }
        } catch {
          // Continue if pipeline not found
        }
      }
    }

    return recommendations;
  }
}

export const crmRecommendations = new CrmRecommendations();