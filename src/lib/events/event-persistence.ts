/**
 * Event Persistence
 * Prepares durable storage of events for replay, audit, and recovery.
 */

export interface PersistedEvent {
  id: string;
  type: string;
  tenantId: string;
  payload: any;
  storedAt: string;
  processed: boolean;
}

export class EventPersistence {
  private store: PersistedEvent[] = [];

  persist(event: Omit<PersistedEvent, "storedAt" | "processed">): PersistedEvent {
    const full: PersistedEvent = {
      ...event,
      storedAt: new Date().toISOString(),
      processed: false,
    };
    this.store.push(full);
    return full;
  }

  markProcessed(id: string): void {
    const e = this.store.find((ev) => ev.id === id);
    if (e) e.processed = true;
  }

  getUnprocessed(tenantId?: string): PersistedEvent[] {
    return this.store.filter((e) => !e.processed && (!tenantId || e.tenantId === tenantId));
  }
}

export const eventPersistence = new EventPersistence();
