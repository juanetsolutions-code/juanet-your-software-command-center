import type { LogContext } from "../observability/log-context";

export type DomainEvent = {
  id: string;
  type: string;
  tenantId?: string;
  timestamp: string;
  payload: Record<string, unknown>;
  metadata?: LogContext;
  version: string;
};

export type EventHandler<T extends DomainEvent = DomainEvent> = {
  id: string;
  eventType: string;
  handler: (event: T) => Promise<void> | void;
  priority?: number;
  tenantScoped?: boolean;
};

export type EventSubscription = {
  handlerId: string;
  eventType: string;
  tenantId?: string;
  isActive: boolean;
};

export type EventBusConfig = {
  enableReplay: boolean;
  maxRetries: number;
  retryDelayMs: number;
};

const DEFAULT_CONFIG: EventBusConfig = {
  enableReplay: true,
  maxRetries: 3,
  retryDelayMs: 1000,
};

class EventBus {
  private handlers: Map<string, EventHandler> = new Map();
  private subscriptions: Map<string, EventSubscription> = new Map();
  private eventHistory: DomainEvent[] = [];
  private config: EventBusConfig = DEFAULT_CONFIG;

  registerHandler(handler: EventHandler): void {
    this.handlers.set(handler.id, handler);
  }

  unregisterHandler(handlerId: string): void {
    this.handlers.delete(handlerId);
    this.subscriptions.delete(handlerId);
  }

  subscribe(subscription: EventSubscription): void {
    this.subscriptions.set(subscription.handlerId, subscription);
  }

  unsubscribe(handlerId: string): void {
    this.subscriptions.delete(handlerId);
  }

  async emit(event: DomainEvent): Promise<void> {
    if (this.config.enableReplay) {
      this.eventHistory.push({ ...event });
    }

    const matchingHandlers = Array.from(this.handlers.values())
      .filter((h) => h.eventType === event.type)
      .filter((h) => {
        if (!h.tenantScoped) return true;
        return !event.tenantId || h.tenantId === event.tenantId;
      })
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    for (const handler of matchingHandlers) {
      const subscription = this.subscriptions.get(handler.id);
      if (!subscription?.isActive) continue;

      try {
        await this.executeWithRetry(() => handler.handler(event));
      } catch (error) {
        console.error(`Event handler ${handler.id} failed for event ${event.type}:`, error);
      }
    }
  }

  private async executeWithRetry(fn: () => Promise<void> | void): Promise<void> {
    let attempts = 0;
    while (attempts < this.config.maxRetries) {
      try {
        await fn();
        return;
      } catch (error) {
        attempts++;
        if (attempts >= this.config.maxRetries) throw error;
        await new Promise((resolve) => setTimeout(resolve, this.config.retryDelayMs * attempts));
      }
    }
  }

  getEventHistory(eventType?: string, tenantId?: string): DomainEvent[] {
    return this.eventHistory.filter((e) => {
      if (eventType && e.type !== eventType) return false;
      if (tenantId && e.tenantId !== tenantId) return false;
      return true;
    });
  }

  replayEvents(eventType: string, tenantId?: string): void {
    const events = this.getEventHistory(eventType, tenantId);
    for (const event of events) {
      this.emit(event).catch(console.error);
    }
  }

  clearHistory(): void {
    this.eventHistory = [];
  }

  updateConfig(config: Partial<EventBusConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getHandlerIds(): string[] {
    return Array.from(this.handlers.keys());
  }
}

export const eventBus = new EventBus();

export function registerEventHandler(handler: EventHandler): void {
  eventBus.registerHandler(handler);
}

export function emitEvent(event: DomainEvent): Promise<void> {
  return eventBus.emit(event);
}

export function getEventHistory(eventType?: string, tenantId?: string): DomainEvent[] {
  return eventBus.getEventHistory(eventType, tenantId);
}

export function replayEvents(eventType: string, tenantId?: string): void {
  eventBus.replayEvents(eventType, tenantId);
}