import type { Lead } from "../core/crm-entities";
import { scoringEngine } from "../services/scoring-engine";

export type LeadScoreResult = {
  leadId: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  aiReady: boolean;
  recommendations: string[];
};

export class LeadScoringAI {
  async analyze(lead: Lead): Promise<LeadScoreResult> {
    const leadScore = await scoringEngine.scoreLead(lead);
    const aiReady = await scoringEngine.getAiReadiness(lead, leadScore.score);

    const recommendations: string[] = [];
    if (leadScore.score < 50) {
      recommendations.push("Increase engagement - low score indicates limited fit");
    }
    if (!lead.phone) {
      recommendations.push("Add phone number for better contact");
    }
    if (!lead.company) {
      recommendations.push("Verify company details");
    }
    if (aiReady) {
      recommendations.push("Ready for AI-driven nurturing");
    }

    return {
      leadId: lead.id,
      score: leadScore.score,
      grade: leadScore.grade,
      aiReady,
      recommendations,
    };
  }

  async batchScore(leads: Lead[]): Promise<LeadScoreResult[]> {
    return Promise.all(leads.map((lead) => this.analyze(lead)));
  }
}

export const leadScoringAI = new LeadScoringAI();