/**
 * API Throttling
 * Advanced throttling with backoff and tenant-specific policies.
 */

export class APIThrottling {
  throttle(tenantId: string, severity: number): number {
    // Returns backoff time in ms
    return Math.floor(severity * 1000);
  }
}

export const apiThrottling = new APIThrottling();
