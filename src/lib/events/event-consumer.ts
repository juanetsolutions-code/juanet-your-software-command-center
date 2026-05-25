/**
 * Event Consumer
 * Base abstraction for consuming events from the bus with retry and DLQ integration.
 */

import { subscribe } from "./event-bus";
import { retryHandlers } from "./retry-handlers";
import { deadLetterQueue } from "./dead-letter-queue";

export abstract class EventConsumer {
  protected abstract handle(payload: any, tenantId: string): Promise<void>;

  subscribe(eventType: string): void {
    subscribe(eventType, async (data: any) => {
      try {
        await this.handle(data.payload, data.tenantId);
      } catch (err: any) {
        const attempt = (data.attempts || 0) + 1;
        if (retryHandlers.shouldRetry(attempt)) {
          // In real system this would schedule retry via scheduler
          console.warn(`[EventConsumer] Retry scheduled for ${eventType}`);
        } else {
          deadLetterQueue.enqueue(
            data.id,
            eventType,
            data.tenantId,
            data.payload,
            err.message,
            attempt,
          );
        }
      }
    });
  }
}
