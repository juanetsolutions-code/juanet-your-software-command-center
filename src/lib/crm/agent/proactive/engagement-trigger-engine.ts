import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";

export class EngagementTriggerEngine {
  detect(lead: Lead): "high" | "medium" | "low" {
    const score = lead.score ?? 0;
    if (score > 80) return "high";
    if (score > 50) return "medium";
    return "low";
  }

  suggestAction(lead: Lead, engagement: "high" | "medium" | "low") {
    switch (engagement) {
      case "high":
        return { type: "immediate_call", priority: "urgent" };
      case "medium":
        return { type: "follow_up_email", priority: "medium" };
      case "low":
        return { type: "nurture_sequence", priority: "low" };
    }
  }
}