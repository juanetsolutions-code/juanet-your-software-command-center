import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import { TABLES } from "@/lib/supabase/schema";
import { toInvoice } from "@/lib/supabase/mappers";
import type { Invoice } from "@/lib/dashboard/types";
import { mockInvoices } from "@/lib/dashboard/mock";

export async function listInvoices(): Promise<Invoice[]> {
  if (!SUPABASE_READY) {
    return mockInvoices;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.invoices)
      .select("*")
      .order("issued_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(toInvoice);
  } catch (err) {
    logger.error("Failed to fetch invoices", err);
    return mockInvoices;
  }
}
