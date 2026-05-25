/**
 * Healing Audit
 * Complete audit trail for all healing-related decisions and preparations.
 * Essential for compliance and post-incident review.
 */

import type { HealingEvent } from "./healing-engine";

export interface HealingAuditEntry {
  id: string;
  healingEventId: string;
  tenantId: string;
  action: string;
  actor: "system" | "ai" | "human";
  timestamp: string;
  details: Record<string, any>;
  outcome: string;
}

export class HealingAudit {
  private logs: HealingAuditEntry[] = [];

  record(entry: Omit<HealingAuditEntry, "id" | "timestamp">): HealingAuditEntry {
    const full: HealingAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.logs.push(full);
    return full;
  }

  getAuditTrail(healingEventId: string): HealingAuditEntry[] {
    return this.logs.filter((l) => l.healingEventId === healingEventId);
  }

  exportForCompliance(tenantId: string, from?: Date): HealingAuditEntry[] {
    return this.logs.filter(
      (l) => l.tenantId === tenantId && (!from || new Date(l.timestamp) >= from),
    );
  }
}

export const healingAudit = new HealingAudit();
