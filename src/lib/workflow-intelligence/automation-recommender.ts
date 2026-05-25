/**
 * Workflow Intelligence Engine - Automation Recommender
 * Recommends specific automation opportunities based on analysis.
 */

export class AutomationRecommender {
  recommend(analysis: any): any[] {
    return (
      analysis.repetitivePatterns?.map((p: any) => ({
        pattern: p[0],
        frequency: p[1],
        recommendation: "Create automated workflow for this pattern",
        confidence: Math.min(p[1] / 20, 0.95),
      })) || []
    );
  }
}

export const automationRecommender = new AutomationRecommender();
