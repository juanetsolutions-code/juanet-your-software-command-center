/**
 * Billing Orchestrator
 * Coordinates invoice, usage, payment, and renewal flows in a single pipeline.
 */

import { invoiceGeneration } from "./invoice-generation";
import { usageBilling } from "./usage-billing";

export class BillingOrchestrator {
  async runMonthlyCycle(
    tenantId: string,
    usage: Record<string, number>,
    prices: Record<string, number>,
  ): Promise<any> {
    const items = usageBilling.aggregate(tenantId, usage, prices);
    const total = items.reduce((sum, i) => sum + i.total, 0);
    const invoice = invoiceGeneration.generate(tenantId, total);
    return { invoice, lineItems: items };
  }
}

export const billingOrchestrator = new BillingOrchestrator();
