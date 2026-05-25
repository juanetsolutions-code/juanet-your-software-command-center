/**
 * Dead Letter Queue
 * Captures permanently failed events for manual review or replay.
 */

export interface DeadLetterEvent {
  id: string;
  originalEventId: string;
  type: string;
  tenantId: string;
  payload: any;
  failureReason: string;
  failedAt: string;
  attempts: number;
}

export class DeadLetterQueue {
  private dlq: DeadLetterEvent[] = [];

  enqueue(
    originalId: string,
    type: string,
    tenantId: string,
    payload: any,
    reason: string,
    attempts: number,
  ): DeadLetterEvent {
    const entry: DeadLetterEvent = {
      id: `dlq-${Date.now()}`,
      originalEventId: originalId,
      type,
      tenantId,
      payload,
      failureReason: reason,
      failedAt: new Date().toISOString(),
      attempts,
    };
    this.dlq.push(entry);
    return entry;
  }

  getDeadLetters(tenantId?: string): DeadLetterEvent[] {
    return tenantId ? this.dlq.filter((e) => e.tenantId === tenantId) : this.dlq;
  }
}

export const deadLetterQueue = new DeadLetterQueue();
