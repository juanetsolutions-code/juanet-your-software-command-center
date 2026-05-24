/**
 * Event Store
 * Supabase-ready persistent storage for events (currently in-memory with persistence hooks).
 */

import type { BaseEvent } from './event-types';

const persistentStore: BaseEvent[] = [];

export async function persistEvent(event: BaseEvent): Promise<void> {
  // Placeholder for Supabase insert
  // await supabase.from('events').insert(event);
  persistentStore.push(event);
}

export async function replayEvents(tenantId: string, fromTimestamp?: string): Promise<BaseEvent[]> {
  // Future: query from Supabase
  return persistentStore.filter(e =>
    e.tenantId === tenantId &&
    (!fromTimestamp || e.timestamp >= fromTimestamp)
  );
}
