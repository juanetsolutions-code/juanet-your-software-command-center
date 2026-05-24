/**
 * Engagement Events
 * Captures key engagement signals for customer success.
 */

export interface EngagementEvent {
  tenantId: string;
  event: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const events: EngagementEvent[] = [];

export function logEngagementEvent(
  tenantId: string,
  event: string,
  metadata?: Record<string, any>,
) {
  events.push({
    tenantId,
    event,
    timestamp: new Date().toISOString(),
    metadata,
  });
}

export function getRecentEngagement(tenantId: string, limit = 20) {
  return events.filter((e) => e.tenantId === tenantId).slice(-limit);
}
