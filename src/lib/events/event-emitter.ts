/**
 * Event Emitter helper
 * Convenience wrapper around the main event bus.
 */

import { emitEvent } from './event-bus';
import type { BaseEvent } from './event-types';

export function emitDomainEvent(
  type: string,
  tenantId: string,
  payload: Record<string, any>,
  userId?: string
): void {
  const event: Omit<BaseEvent, 'timestamp'> = {
    type,
    tenantId,
    userId,
    payload,
  };
  emitEvent(event);
}
