import type { Lead } from "../../core/crm-entities";
import type { Deal } from "../../core/crm-entities";
import { taskService } from "../../tasks/task-service";

export type Interaction = {
  id: string;
  entityId: string;
  type: "call" | "email" | "meeting" | "note";
  timestamp: string;
  duration?: number;
  outcome?: string;
};

export class InteractionHistory {
  private interactions: Interaction[] = [];

  add(interaction: Interaction): void {
    this.interactions.push(interaction);
  }

  getByEntity(entityId: string): Interaction[] {
    return this.interactions.filter((i) => i.entityId === entityId);
  }

  getSummary(entityId: string): { total: number; lastInteraction?: string } {
    const events = this.getByEntity(entityId);
    return {
      total: events.length,
      lastInteraction: events.length > 0 ? events[events.length - 1].timestamp : undefined,
    };
  }
}

export const interactionHistory = new InteractionHistory();