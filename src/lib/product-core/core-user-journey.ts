import type { Lead } from "@/lib/crm/core/crm-entities";
import type { Deal } from "@/lib/crm/core/crm-entities";

export type CoreUserJourney = {
  step: "leads" | "qualification" | "followup" | "deals" | "close";
  primaryMetric: string;
  nextAction?: string;
  timeToComplete?: string;
};

export class CoreUserJourneyEngine {
  getJourney(tenantId: string): CoreUserJourney[] {
    return [
      { step: "leads", primaryMetric: "Leads captured", timeToComplete: "Ongoing" },
      { step: "qualification", primaryMetric: "Hot leads identified", timeToComplete: "2-4 hrs" },
      { step: "followup", primaryMetric: "Outreach completed", timeToComplete: "1-2 days" },
      { step: "deals", primaryMetric: "Qualified deals", timeToComplete: "1-2 weeks" },
      { step: "close", primaryMetric: "Revenue generated", timeToComplete: "Ongoing" },
    ];
  }
}