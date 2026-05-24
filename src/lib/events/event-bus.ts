/**
 * Core Event Bus
 * In-memory + persistent (Supabase-ready) event bus for internal communication.
 */

import { EventEmitter } from 'events';
import type { BaseEvent, DomainEventType } from './event-types';

const emitter = new EventEmitter();
const eventLog: BaseEvent[] = []; // In-memory store for now (replace with Supabase later)

export function emitEvent(event: Omit<BaseEvent, 'timestamp'>): void {
  const fullEvent: BaseEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  eventLog.push(fullEvent);
  emitter.emit(event.type, fullEvent);

  // Future: persist to Supabase events table
  console.log(`[EventBus] Emitted: ${event.type} for tenant ${event.tenantId}`);
}

export function subscribe(
  eventType: DomainEventType | string,
  handler: (event: BaseEvent) => void | Promise<void>
): () => void {
  const wrapped = async (event: BaseEvent) => {
    try {
      await handler(event);
    } catch (err) {
      console.error(`[EventBus] Handler failed for ${eventType}:`, err);
    }
  };

  emitter.on(eventType, wrapped);

  return () => {
    emitter.off(eventType, wrapped);
  };
}

export function getEventHistory(tenantId?: string): BaseEvent[] {
  if (tenantId) {
    return eventLog.filter(e => e.tenantId === tenantId);
  }
  return [...eventLog];
}

export function clearEventLog(): void {
  eventLog.length = 0;
}

/**
 * AI Integration: Allow agents to subscribe to domain events safely.
 */
export function subscribeForAI(
  eventType: string,
  handler: (event: BaseEvent) => void
): () => void {
  return subscribe(eventType as any, handler);
}

/**
 * AI-friendly emit helper (used by agents and orchestrator).
 */
export function emitForAI(
  type: string,
  tenantId: string,
  payload: Record<string, any>,
  userId?: string
): void {
  emitEvent({ type, tenantId, userId, payload });
}
