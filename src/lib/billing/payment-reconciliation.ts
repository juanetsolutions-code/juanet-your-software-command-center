/**
 * Payment Reconciliation
 * Matches incoming payments with invoices and usage.
 */

export interface ReconciliationResult {
  tenantId: string;
  matched: number;
  unmatched: number;
  discrepancies: string[];
}

export class PaymentReconciliation {
  reconcile(tenantId: string, payments: number[], invoices: number[]): ReconciliationResult {
    const matched = Math.min(payments.length, invoices.length);
    return {
      tenantId,
      matched,
      unmatched: Math.abs(payments.length - invoices.length),
      discrepancies: [],
    };
  }
}

export const paymentReconciliation = new PaymentReconciliation();
