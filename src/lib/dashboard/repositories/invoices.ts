import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Invoice, Currency, InvoiceStatus } from "@/lib/dashboard/types";
import type { DbInvoice } from "@/lib/supabase/types";
import { mockInvoices } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelectFrom, safeUpdate, mapDate } from "./_shared";
import { afterMutation } from "../cache";
import { scopedQuery } from "@/lib/tenant/context";

function mapInvoiceRow(row: DbInvoice): Invoice {
  return {
    id: row.id,
    projectName: row.project_id ?? "—",
    amount: Number(row.amount ?? 0),
    currency: ((row.currency as Currency) || "USD") as Currency,
    status: ((row.status as InvoiceStatus) || "draft") as InvoiceStatus,
    issuedLabel: mapDate(row.created_at),
    dueLabel: mapDate(row.due_at),
  };
}

const mapDbInvoice = mapInvoiceRow; // alias

export async function listInvoices(): Promise<Invoice[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock invoices data");
    return mockInvoices;
  }

  try {
    const rows = await safeSelectFrom<DbInvoice>(supabase, "listInvoices", (c) => {
      let q = c.from("invoices").select("*").order("created_at", { ascending: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = scopedQuery(q as any) as any;
      return q;
    });
    if (rows.length === 0) return mockInvoices;
    return rows.map(mapDbInvoice);
  } catch (err) {
    handleSupabaseError(err, "listInvoices");
    return mockInvoices;
  }
}

export async function getInvoice(id: string): Promise<Invoice | undefined> {
  if (!SUPABASE_READY) {
    return mockInvoices.find((i) => i.id === id);
  }

  try {
    const rows = await safeSelectFrom<DbInvoice>(supabase, "getInvoice", (c) =>
      c.from("invoices").select("*").eq("id", id).limit(1),
    );
    if (rows.length === 0) return undefined;
    return mapInvoiceRow(rows[0]);
  } catch (err) {
    handleSupabaseError(err, "getInvoice");
    return mockInvoices.find((i) => i.id === id);
  }
}

export async function updateInvoiceStatus(
  invoiceId: string,
  status: InvoiceStatus,
  userId?: string,
): Promise<boolean> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] updateInvoiceStatus");
    return true;
  }

  if (!invoiceId || !status) {
    logger.warn("[Invoices] updateInvoiceStatus invalid");
    return false;
  }

  try {
    const updated = await safeUpdate<DbInvoice>(
      supabase,
      "updateInvoiceStatus",
      "invoices",
      { status },
      { id: invoiceId },
    );
    if (updated) {
      afterMutation("invoices", userId);
      return true;
    }
    return false;
  } catch (err) {
    handleSupabaseError(err, "updateInvoiceStatus");
    return false;
  }
}
