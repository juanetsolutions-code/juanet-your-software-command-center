import type { DomainEvent } from "@/lib/event-bus/event-bus";

export type SystemEvent = {
  id: string;
  source: string;
  type: string;
  tenantId?: string;
  priority: number;
  timestamp: string;
  data: Record<string, unknown>;
};

export class EventFusionEngine {
  private eventBuffer: Map<string, SystemEvent[]> = new Map();

  fuse(event: DomainEvent): SystemEvent {
    const systemEvent: SystemEvent = {
      id: event.id,
      source: this.identifySource(event),
      type: event.type,
      tenantId: event.tenantId,
      priority: this.calculatePriority(event),
      timestamp: event.timestamp,
      data: event.payload,
    };

    this.bufferEvent(systemEvent);
    return systemEvent;
  }

  private identifySource(event: DomainEvent): string {
    if (event.type.startsWith("crm.")) return "crm";
    if (event.type.startsWith("agent.")) return "agents";
    if (event.type.startsWith("signal.") || event.type.includes("signal")) return "signals";
    if (event.type.startsWith("automation.")) return "automation";
    if (event.type.startsWith("billing.")) return "billing";
    return "unknown";
  }

  private calculatePriority(event: DomainEvent): number {
    const priorityMap: Record<string, number> = {
      "deal.closed_won": 100,
      "deal.stalled": 90,
      "lead.hot": 90,
      "signal.high_intent": 85,
      "crm.task.created": 70,
      "automation.triggered": 60,
    };

    return priorityMap[event.type] ?? 50;
  }

  private bufferEvent(event: SystemEvent): void {
    if (!event.tenantId) return;

    const buffer = this.eventBuffer.get(event.tenantId) ?? [];
    buffer.push(event);
    
    if (buffer.length > 100) {
      buffer.shift();
    }
    
    this.eventBuffer.set(event.tenantId, buffer);
  }

  getPendingEvents(tenantId: string): SystemEvent[] {
    const events = this.eventBuffer.get(tenantId) ?? [];
    this.eventBuffer.delete(tenantId);
    return events;
  }
}