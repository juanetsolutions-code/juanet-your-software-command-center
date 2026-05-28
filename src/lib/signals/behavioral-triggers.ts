import type { Lead } from "@/lib/crm/core/crm-entities";
import type { Deal } from "@/lib/crm/core/crm-entities";
import { emitEvent } from "@/lib/event-bus";

export type BehavioralTrigger = {
  type: "login_spike" | "feature_exploration" | "api_discovery" | "team_invite";
  entityType: "lead" | "deal";
  entityId: string;
  tenantId: string;
  value: number;
  timestamp: string;
};

export class BehavioralTriggers {
  detectLoginSpike(lead: Lead, loginCount: number): BehavioralTrigger | null {
    if (loginCount > 10) {
      const trigger = {
        type: "login_spike" as const,
        entityType: "lead" as const,
        entityId: lead.id,
        tenantId: lead.tenantId,
        value: loginCount,
        timestamp: new Date().toISOString(),
      };
      
      this.emitTrigger(trigger);
      return trigger;
    }
    return null;
  }

  detectTeamGrowth(deal: Deal, teamSize: number): BehavioralTrigger | null {
    if (teamSize > 10) {
      const trigger = {
        type: "team_invite" as const,
        entityType: "deal" as const,
        entityId: deal.id,
        tenantId: deal.tenantId,
        value: teamSize,
        timestamp: new Date().toISOString(),
      };
      
      this.emitTrigger(trigger);
      return trigger;
    }
    return null;
  }

  private emitTrigger(trigger: BehavioralTrigger): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: `behavioral.${trigger.type}`,
      tenantId: trigger.tenantId,
      timestamp: new Date().toISOString(),
      payload: { trigger },
      version: "1.0",
    });
  }
}