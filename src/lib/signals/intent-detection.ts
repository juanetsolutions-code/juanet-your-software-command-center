import type { Lead } from "@/lib/crm/core/crm-entities";
import { leadService } from "@/lib/crm/services/lead-service";
import { emitEvent } from "@/lib/event-bus";

export type IntentSignal = {
  type: "ready_to_buy" | "researching" | "detracting" | "churning";
  leadId: string;
  tenantId: string;
  confidence: number;
  evidence: string[];
  timestamp: string;
};

export class IntentDetection {
  detect(lead: Lead): IntentSignal | null {
    const signals: IntentSignal["evidence"] = [];
    let type: IntentSignal["type"] = "researching";
    let confidence = 0.5;

    if (lead.score && lead.score >= 80) {
      type = "ready_to_buy";
      confidence = 0.9;
      signals.push("high_lead_score");
    }

    if (lead.score && lead.score < 30 && lead.status === "new") {
      type = "researching";
      confidence = 0.7;
      signals.push("low_engagement");
    }

    if (lead.tags.includes("complaint")) {
      type = "detracting";
      confidence = 0.8;
      signals.push("negative_feedback");
    }

    const signal = {
      type,
      leadId: lead.id,
      tenantId: lead.tenantId,
      confidence,
      evidence: signals,
      timestamp: new Date().toISOString(),
    };

    if (signals.length > 0) {
      emitEvent({
        id: `evt_${Date.now()}`,
        type: `intent.${type}`,
        tenantId: lead.tenantId,
        timestamp: new Date().toISOString(),
        payload: { signal },
        version: "1.0",
      });
    }

    return signals.length > 0 ? signal : null;
  }

  batchDetect(tenantId: string): IntentSignal[] {
    const signals: IntentSignal[] = [];
    const leads = leadService.list(tenantId) as Promise<Lead[]>;
    
    leads.then((leadList) => {
      for (const lead of leadList) {
        const signal = this.detect(lead);
        if (signal) signals.push(signal);
      }
    });

    return signals;
  }
}