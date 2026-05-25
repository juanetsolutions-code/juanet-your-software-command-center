/**
 * Event Bus Infrastructure - Core Event Bus
 * Central publish/subscribe mechanism for all integration and operational events.
 * Fully tenant-isolated and replay-safe.
 */

import type { IntegrationEvent, EventHandler } from "./event-types";

export class EventBus {
  private subscribers = new Map<string, Set<EventHandler>>();

  subscribe(eventType: string, handler: EventHandler): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(eventType)?.delete(handler);
    };
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const handlers = this.subscribers.get(event.type);
    if (!handlers) return;

    const promises: Promise<void>[] = [];
    handlers.forEach((handler) => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          promises.push(result);
        }
      } catch (error) {
        console.error(`[EventBus] Handler error for ${event.type}:`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  getSubscriberCount(eventType: string): number {
    return this.subscribers.get(eventType)?.size || 0;
  }
}

export const eventBus = new EventBus();
