/**
 * Event Bus Infrastructure - Event Streams
 * Manages logical streams for different categories of events (e.g., sync, webhooks, federation).
 */

import type { IntegrationEvent } from "./event-types";

export class EventStreams {
  private streams = new Map<string, IntegrationEvent[]>();

  createStream(name: string): void {
    if (!this.streams.has(name)) {
      this.streams.set(name, []);
    }
  }

  appendToStream(streamName: string, event: IntegrationEvent): void {
    if (!this.streams.has(streamName)) {
      this.createStream(streamName);
    }
    this.streams.get(streamName)!.push(event);
  }

  getStream(streamName: string, tenantId?: string): IntegrationEvent[] {
    const events = this.streams.get(streamName) || [];
    if (tenantId) {
      return events.filter((e) => e.tenantId === tenantId);
    }
    return events;
  }
}

export const eventStreams = new EventStreams();
