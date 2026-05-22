import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { RequestStatus, ServiceRequest, ServiceRequestDraft } from "@/lib/dashboard/types";
import type { DbRequest } from "@/lib/supabase/types";
import { mockRequests } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";
import { afterMutation } from "../cache";
import { scopedQuery } from "@/lib/tenant/context";

/**
 * Maps raw Supabase "requests" row to frontend ServiceRequest shape.
 */
function mapRequestRow(row: DbRequest): ServiceRequest {
  return {
    id: row.id,
    title: row.subject ?? "Untitled Request",
    description: undefined,
    serviceSlug: row.category ?? undefined,
    budgetRange: undefined,
    timeline: undefined,
    deadlineAt: undefined,
    status: (row.status as RequestStatus) || "pending",
    submittedLabel: "—",
  };
}

const mapDbRequestToServiceRequest = mapRequestRow; // alias for compatibility

export async function listRequests(): Promise<ServiceRequest[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock requests data");
    return mockRequests;
  }

  try {
    const rows = await safeSelectFrom<DbRequest>(supabase, "listRequests", (c) => {
      let q = c.from("requests").select("*").order("created_at", { ascending: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = scopedQuery(q as any) as any;
      return q;
    });
    if (rows.length === 0) return mockRequests;
    return rows.map(mapDbRequestToServiceRequest);
  } catch (err) {
    handleSupabaseError(err, "listRequests");
    return mockRequests;
  }
}

/**
 * Create a new service request. Returns the new id or null on failure.
 * Safe: validates minimally, logs, falls back gracefully, never throws.
 */
export async function createServiceRequest(
  draft: ServiceRequestDraft,
  userId: string,
): Promise<{ id: string } | null> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] createServiceRequest (mock)");
    return { id: `mock-req-${Date.now()}` };
  }

  // Basic validation
  if (!draft.title || !draft.serviceSlug) {
    logger.warn("[Requests] createServiceRequest invalid draft");
    return null;
  }

  const payload: Record<string, unknown> = {
    subject: draft.title,
    category: draft.serviceSlug,
    status: "pending",
    user_id: userId,
    // map more fields if schema has them: priority, etc.
  };

  try {
    const inserted = await safeInsert<DbRequest>(
      supabase,
      "createServiceRequest",
      "requests",
      payload,
    );
    if (inserted?.id) {
      afterMutation("requests", userId);
      logger.info(`[Requests] created request ${inserted.id}`);
      return { id: inserted.id };
    }
    return null;
  } catch (err) {
    handleSupabaseError(err, "createServiceRequest");
    return null;
  }
}

/**
 * Update status of a request. Returns true on success.
 */
export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  userId?: string,
): Promise<boolean> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] updateRequestStatus (mock)");
    return true;
  }

  if (!requestId || !status) {
    logger.warn("[Requests] updateRequestStatus invalid args");
    return false;
  }

  try {
    const updated = await safeUpdate<DbRequest>(
      supabase,
      "updateRequestStatus",
      "requests",
      { status },
      { id: requestId },
    );
    if (updated) {
      afterMutation("requests", userId);
      logger.info(`[Requests] updated ${requestId} -> ${status}`);
      return true;
    }
    return false;
  } catch (err) {
    handleSupabaseError(err, "updateRequestStatus");
    return false;
  }
}
