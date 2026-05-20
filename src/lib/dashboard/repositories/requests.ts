import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { ServiceRequest } from "@/lib/dashboard/types";
import type { DbRequest } from "@/lib/supabase/types";
import { mockRequests } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelect } from "./_shared";

/**
 * Maps raw Supabase "requests" row to frontend ServiceRequest shape.
 */
function mapDbRequestToServiceRequest(row: DbRequest): ServiceRequest {
  return {
    id: row.id,
    title: row.subject ?? "Untitled Request",
    description: undefined,
    serviceSlug: row.category ?? undefined,
    budgetRange: undefined,
    timeline: undefined,
    deadlineAt: undefined,
    status: (row.status as any) || "pending",
    submittedLabel: "—",
  };
}

export async function listRequests(): Promise<ServiceRequest[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock requests data");
    return mockRequests;
  }

  try {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = safeSelect<DbRequest>(data);
    return rows.map(mapDbRequestToServiceRequest);
  } catch (err) {
    handleSupabaseError(err, "listRequests");
    logger.warn("[Supabase] Falling back to mock data");
    return mockRequests;
  }
}

// NOTE: Write operations (create/update) are intentionally omitted per requirements.
// Only read integration for now.

import type { ServiceRequestDraft } from "@/lib/dashboard/types";

/**
 * Stub for future create operation. Currently a no-op when Supabase is not
 * configured; safe to call from UI without crashing.
 */
export async function createServiceRequest(
  _draft: ServiceRequestDraft,
  _userId: string,
): Promise<{ id: string } | null> {
  if (!SUPABASE_READY) return null;
  // Future: insert into requests table and return the new id.
  return null;
}

