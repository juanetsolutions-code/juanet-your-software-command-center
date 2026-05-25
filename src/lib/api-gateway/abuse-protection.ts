/**
 * Abuse Protection
 * Detects and mitigates abusive traffic patterns and attacks.
 */

export class AbuseProtection {
  detectAbuse(tenantId: string, requestCount: number, errorRate: number): boolean {
    return requestCount > 5000 || errorRate > 0.3;
  }
}

export const abuseProtection = new AbuseProtection();
