import { DealRepository } from "../repository/deal-repository";
import { crmService } from "./crm-service";
import type { Deal } from "../core/crm-entities";
import type { DealStage, DealPriority } from "../core/crm-types";
import { emitEvent } from "@/lib/event-bus";
import { recordActivity } from "@/lib/activity/activity-feed";
import { sendNotification } from "@/lib/notifications-center/send-notification";

export type DealCreateParams = Omit<Deal, "id" | "createdAt" | "updatedAt">;

export type DealUpdateParams = Partial<Omit<Deal, "id" | "tenantId" | "createdAt" | "updatedAt">>;

export class DealService {
  private repository = new DealRepository();

  async create(params: DealCreateParams, tenantId: string): Promise<Deal> {
    const deal = await this.repository.create({
      ...params,
      tenantId,
    });

    emitEvent({
      id: `evt_${Date.now()}`,
      type: "deal.created",
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { dealId: deal.id },
      version: "1.0",
    });

    recordActivity({
      tenantId,
      userId: deal.assignedTo,
      action: "deal_created",
      targetType: "deal",
      targetId: deal.id,
      metadata: { dealName: deal.name, value: deal.value },
    });

    return deal;
  }

  async update(dealId: string, updates: DealUpdateParams, tenantId: string): Promise<Deal | undefined> {
    const deal = await this.repository.findById(dealId, tenantId);
    if (!deal) return undefined;

    const oldStage = deal.stage;
    const updated = await this.repository.update(dealId, tenantId, updates);

    if (updated) {
      if (oldStage !== updates.stage) {
        emitEvent({
          id: `evt_${Date.now()}`,
          type: "deal.stage_changed",
          tenantId,
          timestamp: new Date().toISOString(),
          payload: { dealId, oldStage, newStage: updates.stage },
          version: "1.0",
        });

        recordActivity({
          tenantId,
          userId: updates.assignedTo,
          action: "deal_stage_changed",
          targetType: "deal",
          targetId: dealId,
          metadata: { oldStage, newStage: updates.stage },
        });

        if (updates.stage === "closed_won") {
          emitEvent({
            id: `evt_${Date.now()}`,
            type: "deal.won",
            tenantId,
            timestamp: new Date().toISOString(),
            payload: { dealId },
            version: "1.0",
          });
        } else if (updates.stage === "closed_lost") {
          emitEvent({
            id: `evt_${Date.now()}`,
            type: "deal.lost",
            tenantId,
            timestamp: new Date().toISOString(),
            payload: { dealId },
            version: "1.0",
          });
        }
      }

      recordActivity({
        tenantId,
        userId: updates.assignedTo,
        action: "deal_updated",
        targetType: "deal",
        targetId: dealId,
        metadata: { changes: updates },
      });
    }

    return updated;
  }

  async getById(dealId: string, tenantId: string): Promise<Deal | undefined> {
    return this.repository.findById(dealId, tenantId);
  }

  async list(tenantId: string, stage?: DealStage, assignedTo?: string): Promise<Deal[]> {
    const result = await this.repository.query({
      tenantId,
      filter: { ...(stage && { stage }), ...(assignedTo && { assignedTo }) },
    });
    return result.deals;
  }

  async forecastRevenue(tenantId: string): Promise<number> {
    return this.repository.forecastRevenue(tenantId);
  }
}

export const dealService = new DealService();