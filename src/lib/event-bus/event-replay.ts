/**
 * Event Bus Infrastructure - Event Replay
 * Allows replaying past events for recovery, debugging, or reprocessing.
 */

import type { IntegrationEvent } from "./event-types";
import { eventPersistence } from "./event-persistence";
import { eventBus } from "./event-bus";

export class EventReplay {
  async replayEventsForTenant(tenantId: string, fromTimestamp?: string): Promise<number> {
    const events = await eventPersistence.getEventsForTenant(tenantId, fromTimestamp);
    let count = 0;

    for (const event of events) {
      await eventBus.publish(event);
      count++;
    }

    return count;
  }

  async replayEventsByType(type: string, tenantId?: string): Promise<number> {
    const events = await eventPersistence.getEventsByType(type, tenantId);
    let count = 0;

    for (const event of events) {
      await eventBus.publish(event);
      count++;
    }

    return count;
  }
}

export const eventReplay = new EventReplay();
