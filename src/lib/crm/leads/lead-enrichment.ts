import type { Lead } from "../core/crm-entities";

export type LeadEnrichment = {
  companyInfo?: {
    size?: string;
    industry?: string;
  };
  techStack?: string[];
  scoreAdjustments?: number;
};

export class LeadEnrichmentService {
  async enrich(lead: Lead): Promise<LeadEnrichment> {
    const enrichment: LeadEnrichment = {};

    if (lead.company) {
      enrichment.companyInfo = {
        size: "unknown",
        industry: this.inferIndustry(lead.company),
      };
    }

    enrichment.techStack = this.inferTechStack(lead);

    return enrichment;
  }

  private inferIndustry(company: string): string {
    const lower = company.toLowerCase();
    if (lower.includes("tech") || lower.includes("software")) return "technology";
    if (lower.includes("bank") || lower.includes("finance")) return "finance";
    if (lower.includes("health")) return "healthcare";
    return "general";
  }

  private inferTechStack(lead: Lead): string[] {
    const stack: string[] = [];
    if (lead.tags.includes("api_user")) stack.push("API");
    if (lead.tags.includes("dashboard_user")) stack.push("Analytics");
    return stack;
  }
}