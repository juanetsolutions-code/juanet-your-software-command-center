import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import { TABLES } from "@/lib/supabase/schema";
import { toPaymentMethod } from "@/lib/supabase/mappers";
import type { PaymentMethod, BillingAddress } from "@/lib/dashboard/types";
import {
  mockPaymentMethods,
  mockBillingAddress,
  mockBillingOverview,
} from "@/lib/dashboard/mock";

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  if (!SUPABASE_READY) {
    return mockPaymentMethods;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.paymentMethods)
      .select("*")
      .order("is_primary", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toPaymentMethod);
  } catch (err) {
    logger.error("Failed to fetch payment methods", err);
    return mockPaymentMethods;
  }
}

export async function getBillingAddress(): Promise<BillingAddress> {
  if (!SUPABASE_READY) {
    return mockBillingAddress;
  }
  // For now return mock until billing_addresses table is used
  return mockBillingAddress;
}

export function getBillingOverview() {
  return mockBillingOverview;
}

export async function markInvoicePaid(invoiceId: string): Promise<void> {
  if (!SUPABASE_READY) return;

  try {
    await supabase.from(TABLES.payments).insert({
      invoice_id: invoiceId,
      amount: 0,
      currency: "USD",
      status: "succeeded",
      processor: "manual",
    });
    await supabase.from(TABLES.invoices).update({ status: "paid" }).eq("id", invoiceId);
  } catch (err) {
    logger.error("Failed to mark invoice as paid", err);
  }
}
