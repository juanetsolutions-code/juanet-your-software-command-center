/**
 * Event Registry
 * Central registry of all known event types, schemas, and handlers in the platform.
 */

export interface EventDefinition {
  type: string;
  version: string;
  description: string;
  schema?: Record<string, any>;
  handlers: string[];
}

export class EventRegistry {
  private registry = new Map<string, EventDefinition>();

  register(def: EventDefinition): void {
    this.registry.set(def.type, def);
  }

  get(type: string): EventDefinition | undefined {
    return this.registry.get(type);
  }

  listAll(): EventDefinition[] {
    return Array.from(this.registry.values());
  }
}

export const eventRegistry = new EventRegistry();
