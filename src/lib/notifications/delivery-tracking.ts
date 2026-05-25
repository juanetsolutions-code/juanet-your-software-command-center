/**
 * Delivery Tracking
 * Tracks email and communication delivery status in real time.
 */

export interface DeliveryStatus {
  messageId: string;
  status: "sent" | "delivered" | "bounced" | "failed";
  timestamp: string;
}

export class DeliveryTracking {
  private statuses = new Map<string, DeliveryStatus>();

  update(messageId: string, status: DeliveryStatus["status"]): void {
    this.statuses.set(messageId, {
      messageId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  get(messageId: string): DeliveryStatus | undefined {
    return this.statuses.get(messageId);
  }
}

export const deliveryTracking = new DeliveryTracking();
