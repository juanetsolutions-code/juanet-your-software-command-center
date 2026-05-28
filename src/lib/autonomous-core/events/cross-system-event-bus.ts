import type { DomainEvent } from "@/lib/event-bus/event-bus";
import type { SystemEvent } from "./event-fusion-engine";

export class CrossSystemEventBus {
  private subscribers: Map<string, Set<(event: SystemEvent) => void>> = new Map();

  publish(event: SystemEvent): void {
    const handlers = this.subscribers.get(event.type);
    handlers?.forEach((handler) => handler(event));
  }

  subscribe(type: string, handler: (event: SystemEvent) => void): void {
    const handlers = this.subscribers.get(type) ?? new Set();
    handlers.add(handler);
    this.subscribers.set(type, handlers);
  }

  unsubscribe(type: string, handler: (event: SystemEvent) => void): void {
    const handlers = this.subscribers.get(type);
    handlers?.delete(handler);
  }

  bridgeFromMainBus(event: DomainEvent): void {
    const systemEvent: SystemEvent = {
      id: event.id,
      source: this.identifySourceByEvent(event),
      type: event.type,
      tenantId: event.tenantId,
      priority: this.priorityFromType(event.type),
      timestamp: event.timestamp,
      data: event.payload,
    };

    this.publish(systemEvent);
  }

  private identifySourceByEvent(event: DomainEvent): string {
    if (event.type.startsWith("deal.") || event.type.startsWith("lead.") || event.type.startsWith("contact.")) return "crm";
    if (event.type.startsWith("agent.")) return "agents";
    if (event.type.includes("signal") || event.type.includes("intent") || event.type.includes("usage")) return "signals";
    if (event.type.startsWith("automation.")) return "automation";
    if (event.type.startsWith("billing.") || event.type.includes("subscription") || event.type.includes("payment")) return "billing";
    return "system";
  }

  private priorityFromType(type: string): number {
    if (type.includes("closed_won") || type.includes("won")) return 100;
    if (type.includes("urgent") || type.includes("high")) return 90;
    if (type.includes("stalled") || type.includes("churn")) return 85;
    return 50;
  }
}