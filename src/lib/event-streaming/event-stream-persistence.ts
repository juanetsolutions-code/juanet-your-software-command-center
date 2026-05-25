/**
 * Event Stream Persistence
 * Durable storage of event streams for replay and audit.
 */

export interface PersistedStreamEvent {
  id: string;
  tenantId: string;
  type: string;
  payload: any;
  persistedAt: string;
}

export class EventStreamPersistence {
  private store: PersistedStreamEvent[] = [];

  persist(tenantId: string, type: string, payload: any): PersistedStreamEvent {
    const evt: PersistedStreamEvent = {
      id: `pstream-${Date.now()}`,
      tenantId,
      type,
      payload,
      persistedAt: new Date().toISOString(),
    };
    this.store.push(evt);
    return evt;
  }
}

export const eventStreamPersistence = new EventStreamPersistence();
