import type { SystemEvent } from "./event-fusion-engine";

export class EventPriorityResolver {
  resolve(events: SystemEvent[]): SystemEvent[] {
    const grouped = this.groupByTenant(events);
    const resolved: SystemEvent[] = [];

    for (const [tenantId, tenantEvents] of Object.entries(grouped)) {
      const sorted = tenantEvents.sort((a, b) => b.priority - a.priority);
      const deduplicated = this.deduplicate(sorted);
      resolved.push(...deduplicated);
    }

    return resolved;
  }

  private groupByTenant(events: SystemEvent[]): Record<string, SystemEvent[]> {
    return events.reduce((acc, event) => {
      const key = event.tenantId ?? "system";
      acc[key] = acc[key] ?? [];
      acc[key].push(event);
      return acc;
    }, {} as Record<string, SystemEvent[]>);
  }

  private deduplicate(events: SystemEvent[]): SystemEvent[] {
    const seen = new Set<string>();
    return events.filter((event) => {
      const key = `${event.type}:${event.tenantId ?? "any"}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}