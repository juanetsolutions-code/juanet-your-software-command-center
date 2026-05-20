import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { PaymentMethod, BillingAddress } from "@/lib/dashboard/types";
import {
  mockPaymentMethods,
  mockBillingAddress,
  mockBillingOverview,
} from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelect } from "./_shared";

interface DbPaymentMethod {
  id: string;
  brand?: string | null;
  last4?: string | null;
  expiry_label?: string | null;
  is_primary?: boolean | null;
}

function mapDbPaymentMethod(row: DbPaymentMethod): PaymentMethod {
  return {
    id: row.id,
    brand: row.brand ?? "CARD",
    last4: row.last4 ?? "0000",
    expiryLabel: row.expiry_label ?? "—",
    primary: !!row.is_primary,
  };
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock payment methods data");
    return mockPaymentMethods;
  }

  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("is_primary", { ascending: false });

    if (error) throw error;
    const rows = safeSelect<DbPaymentMethod>(data);
    if (rows.length === 0) return mockPaymentMethods;
    return rows.map(mapDbPaymentMethod);
  } catch (err) {
    handleSupabaseError(err, "listPaymentMethods");
    return mockPaymentMethods;
  }
}

export async function getBillingAddress(): Promise<BillingAddress> {
  if (!SUPABASE_READY) return mockBillingAddress;
  // billing_addresses table not yet modeled; safe fallback.
  return mockBillingAddress;
}

export function getBillingOverview() {
  return mockBillingOverview;
}

export async function markInvoicePaid(invoiceId: string): Promise<void> {
  if (!SUPABASE_READY) return;

  try {
    const { error: insertErr } = await supabase.from("payments").insert({
      invoice_id: invoiceId,
      amount: 0,
      currency: "USD",
      status: "succeeded",
    });
    if (insertErr) throw insertErr;

    const { error: updateErr } = await supabase
      .from("invoices")
      .update({ status: "paid" })
      .eq("id", invoiceId);
    if (updateErr) throw updateErr;
  } catch (err) {
    handleSupabaseError(err, "markInvoicePaid");
  }
}
