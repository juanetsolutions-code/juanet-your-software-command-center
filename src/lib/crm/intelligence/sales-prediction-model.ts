import type { Lead } from "../core/crm-entities";

export type SalesPrediction = {
  leadId: string;
  willConvert: boolean;
  probability: number;
  timeframeDays: number;
  confidence: "low" | "medium" | "high";
  similarLeadsCount: number;
};

export class SalesPredictionModel {
  async predict(lead: Lead, similarLeads: Lead[] = []): Promise<SalesPrediction> {
    const conversionThreshold = 60;
    const timeframeBase = lead.score ? 30 - (lead.score / 100) * 20 : 20;
    
    const similarConversions = similarLeads.filter((l) => l.status === "converted").length;
    const similarRate = similarLeads.length > 0 ? similarConversions / similarLeads.length : 0;
    
    const probability = Math.round(
      (lead.score ?? 50) * 0.7 + similarRate * 100 * 0.3
    );
    
    const timeframeDays = Math.round(timeframeBase + Math.random() * 10);
    const confidence = similarLeads.length > 10 ? "high" : similarLeads.length > 3 ? "medium" : "low";
    
    return {
      leadId: lead.id,
      willConvert: probability > conversionThreshold,
      probability,
      timeframeDays,
      confidence,
      similarLeadsCount: similarLeads.length,
    };
  }

  async batchPredict(leads: Lead[]): Promise<SalesPrediction[]> {
    return Promise.all(leads.map((lead) => this.predict(lead)));
  }
}

export const salesPredictionModel = new SalesPredictionModel();