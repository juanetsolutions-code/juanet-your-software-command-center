/**
 * Operational KPIs
 * Prepares enterprise-grade operational key performance indicators.
 */

export interface OperationalKPI {
  name: string;
  tenantId: string;
  value: number;
  target: number;
  unit: string;
  status: "on_track" | "at_risk" | "off_track";
  period: string;
}

export class OperationalKPIs {
  compute(tenantId: string, raw: Record<string, number>): OperationalKPI[] {
    return Object.entries(raw).map(([name, value]) => ({
      name,
      tenantId,
      value,
      target: name.includes("uptime") ? 99.9 : 500,
      unit: name.includes("rate") ? "%" : "ms",
      status: value > 800 ? "at_risk" : "on_track",
      period: "last_24h",
    }));
  }
}

export const operationalKPIs = new OperationalKPIs();
