/**
 * Billing Audit
 * Immutable records of all billing, invoice, and payment events.
 */

export interface BillingAuditEntry {
  id: string;
  tenantId: string;
  event: "invoice_created" | "payment_received" | "subscription_changed";
  amount?: number;
  details: Record<string, any>;
  timestamp: string;
}

export class BillingAudit {
  private log: BillingAuditEntry[] = [];

  record(entry: Omit<BillingAuditEntry, "id" | "timestamp">): BillingAuditEntry {
    const full = { ...entry, id: `bill-${Date.now()}`, timestamp: new Date().toISOString() };
    this.log.push(full);
    return full;
  }
}

export const billingAudit = new BillingAudit();
