/**
 * Breach Detection
 * Detects SLA breaches and triggers notifications/escalations.
 */

export interface Breach {
  tenantId: string;
  metric: string;
  actual: number;
  target: number;
  detectedAt: string;
}

export class BreachDetection {
  detect(tenantId: string, metric: string, actual: number, target: number): Breach | null {
    if (actual < target) {
      return {
        tenantId,
        metric,
        actual,
        target,
        detectedAt: new Date().toISOString(),
      };
    }
    return null;
  }
}

export const breachDetection = new BreachDetection();
