import type { Deal } from "../core/crm-entities";
import type { Lead } from "../core/crm-entities";

export type Signal = {
  id: string;
  type: "deal_stuck" | "lead_going_cold" | "high_intent" | "urgent_followup" | "conversion_ready";
  entityType: "deal" | "lead";
  entityId: string;
  severity: "info" | "warning" | "critical";
  message: string;
  suggestedAction?: string;
  detectedAt: string;
};

export class SignalEngine {
  detect(deal: Deal, daysSinceUpdate: number): Signal | null {
    if (deal.stage !== "closed_won" && deal.stage !== "closed_lost" && daysSinceUpdate > 14) {
      return {
        id: `sig_${Date.now()}`,
        type: "deal_stuck",
        entityType: "deal",
        entityId: deal.id,
        severity: "critical",
        message: `Deal "${deal.name}" has no activity for ${daysSinceUpdate} days`,
        suggestedAction: "Schedule immediate follow-up",
        detectedAt: new Date().toISOString(),
      };
    }
    
    return null;
  }

  detectLead(lead: Lead): Signal | null {
    const score = lead.score ?? 0;
    if (score > 85) {
      return {
        id: `sig_${Date.now()}`,
        type: "high_intent",
        entityType: "lead",
        entityId: lead.id,
        severity: "info",
        message: `${lead.firstName} ${lead.lastName} shows high engagement`,
        suggestedAction: "Prioritize this lead for immediate contact",
        detectedAt: new Date().toISOString(),
      };
    }
    
    return null;
  }

  getAllSignals(): Signal[] {
    return [];
  }
}

export const signalEngine = new SignalEngine();