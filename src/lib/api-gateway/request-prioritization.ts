/**
 * Request Prioritization
 * Prioritizes critical tenant and system requests during load.
 */

export class RequestPrioritization {
  getPriority(tenantId: string, path: string, isCritical: boolean): number {
    if (isCritical) return 0;
    if (path.includes("admin")) return 10;
    return 5;
  }
}

export const requestPrioritization = new RequestPrioritization();
