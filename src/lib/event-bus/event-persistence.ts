/**
 * Event Bus Infrastructure - Event Persistence
 * Provides durable storage for events to support replay, auditing, and recovery.
 */

import type { IntegrationEvent } from "./event-types";

export class EventPersistence {
  private store: IntegrationEvent[] = []; // In real system: database or event store

  async persist(event: IntegrationEvent): Promise<void> {
    this.store.push(event);
    // Future: persist to Supabase/Postgres or dedicated event store (Kafka, etc.)
  }

  async getEventsForTenant(tenantId: string, fromTimestamp?: string): Promise<IntegrationEvent[]> {
    return this.store.filter(
      (e) => e.tenantId === tenantId && (!fromTimestamp || e.timestamp >= fromTimestamp),
    );
  }

  async getEventsByType(type: string, tenantId?: string): Promise<IntegrationEvent[]> {
    return this.store.filter((e) => e.type === type && (!tenantId || e.tenantId === tenantId));
  }
}

export const eventPersistence = new EventPersistence();
