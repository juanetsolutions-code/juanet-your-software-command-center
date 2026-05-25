/**
 * Event Bus Infrastructure - Event Router
 * Routes events to the correct handlers based on type, tenant, and priority.
 */

import type { IntegrationEvent } from "./event-types";
import { eventBus } from "./event-bus";

export class EventRouter {
  private routingRules = new Map<string, string[]>(); // eventType -> handlerIds or topics

  registerRoute(eventType: string, destination: string): void {
    if (!this.routingRules.has(eventType)) {
      this.routingRules.set(eventType, []);
    }
    this.routingRules.get(eventType)!.push(destination);
  }

  async routeEvent(event: IntegrationEvent): Promise<void> {
    const routes = this.routingRules.get(event.type) || ["default"];

    // In real implementation this would fan out to queues, webhooks, etc.
    await eventBus.publish(event);

    // Example: could publish to specific streams based on routes
    console.log(
      `[EventRouter] Event ${event.type} routed for tenant ${event.tenantId} via ${routes.join(", ")}`,
    );
  }
}

export const eventRouter = new EventRouter();
