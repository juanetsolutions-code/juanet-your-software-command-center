import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { PaymentMethod, BillingAddress } from "@/lib/dashboard/types";
import type { DbPayment } from "@/lib/supabase/types";
import { mockPaymentMethods, mockBillingAddress, mockBillingOverview } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";
import { afterMutation } from "../cache";
import { scopedQuery } from "@/lib/tenant/context";

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

function mapPaymentRow(row: DbPayment): {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
} {
  return {
    id: row.id,
    invoiceId: row.invoice_id,
    amount: Number(row.amount ?? 0),
    currency: row.currency || "USD",
    status: row.status || "pending",
    createdAt: row.created_at,
  };
}

export async function listPaymentMethods(): Promise<PaymentMethod[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock payment methods data");
    return mockPaymentMethods;
  }

  try {
    const rows = await safeSelectFrom<DbPaymentMethod>(supabase, "listPaymentMethods", (c) => {
      let q = c.from("payment_methods").select("*").order("is_primary", { ascending: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = scopedQuery(q as any) as any;
      return q;
    });
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
    await safeInsert(supabase, "markInvoicePaid.insertPayment", "payments", {
      invoice_id: invoiceId,
      amount: 0,
      currency: "USD",
      status: "succeeded",
    });

    await safeUpdate(
      supabase,
      "markInvoicePaid.updateInvoice",
      "invoices",
      { status: "paid" },
      { id: invoiceId },
    );
    afterMutation("invoices");
    afterMutation("payments");
  } catch (err) {
    handleSupabaseError(err, "markInvoicePaid");
  }
}

/**
 * List payments (real data for payment history / audit).
 */
export async function listPayments(): Promise<Array<ReturnType<typeof mapPaymentRow>>> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock payments (empty for now)");
    return [];
  }

  try {
    const rows = await safeSelectFrom<DbPayment>(supabase, "listPayments", (c) =>
      c.from("payments").select("*").order("created_at", { ascending: false }),
    );
    return rows.map(mapPaymentRow);
  } catch (err) {
    handleSupabaseError(err, "listPayments");
    return [];
  }
}

/**
 * Record a payment (used by mark etc, or direct).
 */
export async function createPaymentRecord(
  invoiceId: string,
  amount: number,
  currency = "USD",
  status = "succeeded",
  userId?: string,
): Promise<boolean> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] createPaymentRecord");
    return true;
  }

  try {
    const inserted = await safeInsert(supabase, "createPaymentRecord", "payments", {
      invoice_id: invoiceId,
      amount,
      currency,
      status,
      user_id: userId,
    });
    if (inserted) {
      afterMutation("payments", userId);
      return true;
    }
    return false;
  } catch (err) {
    handleSupabaseError(err, "createPaymentRecord");
    return false;
  }
}
