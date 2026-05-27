/**
 * Realtime Events - Infrastructure for realtime updates
 */

export type EventType = "activity" | "notification" | "project_update" | "message" | "invoice";

export interface RealtimeEvent {
  type: EventType;
  payload: unknown;
  timestamp: string;
}

type EventHandler = (event: RealtimeEvent) => void;
const handlers: Map<EventType, EventHandler[]> = new Map();

export function subscribe(eventType: EventType, handler: EventHandler): () => void {
  const existing = handlers.get(eventType) || [];
  handlers.set(eventType, [...existing, handler]);

  return () => {
    const current = handlers.get(eventType) || [];
    handlers.set(
      eventType,
      current.filter((h) => h !== handler),
    );
  };
}

export function emit(event: RealtimeEvent): void {
  const eventHandlers = handlers.get(event.type) || [];
  eventHandlers.forEach((h) => h(event));
}

export function createUserEvent(userId: string, type: EventType, payload: unknown): RealtimeEvent {
  return {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };
}
