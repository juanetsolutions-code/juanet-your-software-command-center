import type { Lead } from "../core/crm-entities";
import { leadService } from "../services/lead-service";
import type { LeadStatus } from "../core/crm-types";

export type LeadAutomationRule = {
  id: string;
  tenantId: string;
  name: string;
  trigger: "created" | "updated" | "status_change" | "score_threshold";
  conditions: Record<string, unknown>;
  actions: Array<{
    type: "assign" | "notify" | "create_task" | "send_email" | "qualify";
    payload: Record<string, unknown>;
  }>;
  isActive: boolean;
};

export class LeadAutomation {
  private rules: LeadAutomationRule[] = [];

  register(rule: Omit<LeadAutomationRule, "id">): LeadAutomationRule {
    const newRule: LeadAutomationRule = {
      ...rule,
      id: `auto_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    };
    this.rules.push(newRule);
    return newRule;
  }

  async processNewLead(lead: Lead): Promise<void> {
    const matchingRules = this.rules.filter(
      (r) => r.isActive && r.trigger === "created"
    );

    for (const rule of matchingRules) {
      await this.executeActions(rule.actions, { lead });
    }
  }

  async processLeadUpdate(lead: Lead, oldStatus?: LeadStatus): Promise<void> {
    const matchingRules = this.rules.filter((r) => {
      if (!r.isActive) return false;
      if (r.trigger === "status_change" && oldStatus !== lead.status) return true;
      if (r.trigger === "updated") return true;
      return false;
    });

    for (const rule of matchingRules) {
      await this.executeActions(rule.actions, { lead, oldStatus });
    }
  }

  private async executeActions(actions: LeadAutomationRule["actions"], context: Record<string, unknown>): Promise<void> {
    for (const action of actions) {
      switch (action.type) {
        case "create_task":
          await this.createTaskAction(action.payload, context);
          break;
        case "assign":
          await this.assignAction(action.payload, context);
          break;
        case "notify":
          await this.notifyAction(action.payload, context);
          break;
      }
    }
  }

  private async createTaskAction(payload: Record<string, unknown>, context: Record<string, unknown>): Promise<void> {
    const lead = context.lead as Lead;
    // Task creation hook
    console.log(`[Automation] Creating task for lead ${lead.id}: ${payload.title}`);
  }

  private async assignAction(payload: Record<string, unknown>, context: Record<string, unknown>): Promise<void> {
    const lead = context.lead as Lead;
    // Assignment hook
    console.log(`[Automation] Assigning lead ${lead.id} to ${payload.userId}`);
  }

  private async notifyAction(payload: Record<string, unknown>, context: Record<string, unknown>): Promise<void> {
    // Notification hook
    console.log(`[Automation] Sending notification: ${payload.message}`);
  }
}

export const leadAutomation = new LeadAutomation();