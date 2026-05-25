/**
 * Uptime Tracker
 * Tracks uptime and downtime per service and tenant.
 */

export interface UptimeRecord {
  tenantId: string;
  service: string;
  uptimePercentage: number;
  downtimeMinutes: number;
  period: string;
}

export class UptimeTracker {
  private records: UptimeRecord[] = [];

  record(tenantId: string, service: string, uptime: number, downtime: number): UptimeRecord {
    const rec: UptimeRecord = {
      tenantId,
      service,
      uptimePercentage: uptime,
      downtimeMinutes: downtime,
      period: new Date().toISOString().slice(0, 7),
    };
    this.records.push(rec);
    return rec;
  }
}

export const uptimeTracker = new UptimeTracker();
