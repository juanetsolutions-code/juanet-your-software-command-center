import type { DomainEvent } from "@/lib/event-bus/event-bus";

export class AgentCommunicationBus {
  private subscribers: Map<string, Set<(event: DomainEvent) => void>> = new Map();
  private tenantChannels: Map<string, Set<string>> = new Map();

  publish(channel: string, event: DomainEvent): void {
    const handlers = this.subscribers.get(channel);
    handlers?.forEach((handler) => handler(event));
  }

  subscribe(channel: string, handler: (event: DomainEvent) => void, tenantId?: string): void {
    const handlers = this.subscribers.get(channel) ?? new Set();
    handlers.add(handler);
    this.subscribers.set(channel, handlers);

    if (tenantId) {
      const channels = this.tenantChannels.get(tenantId) ?? new Set();
      channels.add(channel);
      this.tenantChannels.set(tenantId, channels);
    }
  }

  unsubscribe(channel: string, handler: (event: DomainEvent) => void): void {
    const handlers = this.subscribers.get(channel);
    handlers?.delete(handler);
  }

  getTenantChannels(tenantId: string): string[] {
    return Array.from(this.tenantChannels.get(tenantId) ?? []);
  }

  broadcast(event: DomainEvent): void {
    Array.from(this.subscribers.entries()).forEach(([channel, handlers]) => {
      if (channel.startsWith("tenant_")) continue; // Skip tenant-specific channels
      handlers.forEach((handler) => handler(event));
    });
  }
}

export const agentCommBus = new AgentCommunicationBus();