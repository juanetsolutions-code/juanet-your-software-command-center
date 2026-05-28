import type { Lead } from "@/lib/crm/core/crm-entities";

export type GeneratedMessage = {
  subject: string;
  content: string;
  tone: "professional" | "friendly" | "urgency";
  channel: "email" | "in_app";
};

export class MessageGenerator {
  generate(lead: Lead, context?: string): GeneratedMessage {
    const industry = this.detectIndustry(lead);
    const tone = this.determineTone(lead);
    
    return {
      subject: this.createSubject(lead, industry, context),
      content: this.createContent(lead, industry, context),
      tone,
      channel: "email",
    };
  }

  private detectIndustry(lead: Lead): string {
    const company = lead.company?.toLowerCase() ?? "";
    
    if (company.includes("tech") || company.includes("software")) return "tech";
    if (company.includes("finance") || company.includes("bank")) return "finance";
    if (company.includes("health") || company.includes("medical")) return "healthcare";
    
    return "general";
  }

  private determineTone(lead: Lead): "professional" | "friendly" | "urgency" {
    if ((lead.score ?? 0) >= 80) return "urgency";
    return "professional";
  }

  private createSubject(lead: Lead, industry: string, context?: string): string {
    const templates: Record<string, string[]> = {
      tech: ["Boost your dev workflow with Juanet", "Juanet for modern development teams"],
      finance: ["Secure your financial operations", "Juanet for compliance & efficiency"],
      healthcare: ["Streamline your healthcare operations", "Juanet for patient data management"],
      general: ["Quick question about Juanet", "Unlock more value from Juanet"],
    };
    
    const options = templates[industry] ?? templates.general;
    return options[Math.floor(Math.random() * options.length)];
  }

  private createContent(lead: Lead, industry: string, context?: string): string {
    return `Hi ${lead.firstName},\n\nI've been following ${lead.company ? `${lead.company}'s progress` : 'your activity'} on Juanet and wanted to reach out.\n\n${context ?? 'We have some exciting updates that might help you get even more value from our platform.'}\n\nWould you have time for a quick call this week?\n\nBest,\nThe Juanet Team`;
  }
}