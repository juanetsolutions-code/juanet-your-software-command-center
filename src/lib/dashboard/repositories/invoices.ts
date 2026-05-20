import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Invoice, Currency, InvoiceStatus } from "@/lib/dashboard/types";
import type { DbInvoice } from "@/lib/supabase/types";
import { mockInvoices } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelect, mapDate } from "./_shared";

function mapDbInvoice(row: DbInvoice): Invoice {
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

export async function listInvoices(): Promise<Invoice[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock invoices data");
    return mockInvoices;
  }

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    const rows = safeSelect<DbInvoice>(data);
    if (rows.length === 0) return mockInvoices;
    return rows.map(mapDbInvoice);
  } catch (err) {
    handleSupabaseError(err, "listInvoices");
    return mockInvoices;
  }
}
