/**
 * Bounce Handling
 * Processes and reacts to email bounces and complaints.
 */

export class BounceHandling {
  handleBounce(messageId: string, reason: string, tenantId: string): void {
    // In real: update suppression lists, alert tenant, etc.
    console.log(`[Comm] Bounce for ${messageId} tenant ${tenantId}: ${reason}`);
  }
}

export const bounceHandling = new BounceHandling();
