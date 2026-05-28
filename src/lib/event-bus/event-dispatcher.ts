import type { DomainEvent, EventHandler } from "./event-bus";

export type EventDispatcherConfig = {
  batchSize?: number;
  concurrency?: number;
  enableParallel?: boolean;
};

export class EventDispatcher {
  private handlers: Map<string, EventHandler> = new Map();
  private config: EventDispatcherConfig = {
    batchSize: 100,
    concurrency: 10,
    enableParallel: true,
  };

  register(handler: EventHandler): void {
    this.handlers.set(handler.id, handler);
  }

  async dispatch(event: DomainEvent): Promise<void> {
    const matchingHandlers = Array.from(this.handlers.values()).filter(
      (h) => h.eventType === event.type
    );

    if (this.config.enableParallel && matchingHandlers.length > 1) {
      await Promise.all(
        matchingHandlers.map((h) => this.executeHandler(h, event))
      );
    } else {
      for (const handler of matchingHandlers) {
        await this.executeHandler(handler, event);
      }
    }
  }

  private async executeHandler(handler: EventHandler, event: DomainEvent): Promise<void> {
    try {
      const result = handler.handler(event);
      await result;
    } catch (error) {
      console.error(`Event handler ${handler.id} failed:`, error);
    }
  }

  configure(config: Partial<EventDispatcherConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getHandlerCount(): number {
    return this.handlers.size;
  }
}

export const eventDispatcher = new EventDispatcher();

export function dispatchEvent(event: DomainEvent): Promise<void> {
  return eventDispatcher.dispatch(event);
}

export function getHandlerCount(): number {
  return eventDispatcher.getHandlerCount();
}