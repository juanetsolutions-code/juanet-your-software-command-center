/**
 * Event Dispatcher
 * Central dispatcher for reliable, async-safe event delivery across the platform.
 */

import { emitEvent, subscribe } from "./event-bus";

export interface DispatchedEvent {
  id: string;
  type: string;
  payload: any;
  tenantId: string;
  timestamp: string;
  attempts: number;
}

export class EventDispatcher {
  async dispatch(type: string, payload: any, tenantId: string): Promise<DispatchedEvent> {
    const event: DispatchedEvent = {
      id: `evt-${Date.now()}`,
      type,
      payload,
      tenantId,
      timestamp: new Date().toISOString(),
      attempts: 0,
    };

    // Publish to internal bus (real impl would go to queue)
    emitEvent({ type, tenantId, payload: { ...event, tenantId } } as any);

    return event;
  }
}

export const eventDispatcher = new EventDispatcher();
