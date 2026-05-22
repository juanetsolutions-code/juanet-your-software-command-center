/**
 * Realtime foundation for Juanet dashboard.
 * Repository-ready subscription helpers.
 * No UI wiring yet — call from future hooks or stores.
 *
 * Usage example (future):
 *   const sub = subscribeToTable('messages', { filter: `conversation_id=eq.${id}` }, (payload) => { ... });
 *   // later unsubscribe(sub)
 */

import { supabase, SUPABASE_READY } from "./client";
import { logger } from "@/lib/utils/logger";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type Subscription = {
  channel: RealtimeChannel;
  table: string;
};

const activeSubscriptions = new Map<string, Subscription>();

function makeKey(table: string, filter?: string) {
  return `${table}:${filter || "all"}`;
}

export type ChangePayload<T = unknown> = RealtimePostgresChangesPayload<{
  new: T;
  old: T;
}>;

export interface SubscribeOptions {
  filter?: string; // e.g. "conversation_id=eq.abc123"
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  orgId?: string; // tenant isolation
  workspaceId?: string;
  onInsert?: (row: unknown) => void;
  onUpdate?: (row: unknown) => void;
  onDelete?: (row: unknown) => void;
  onChange?: (payload: ChangePayload) => void;
}

/**
 * Subscribe to changes on a table (with optional row filter).
 * Returns a subscription handle for unsubscribe.
 */
export function subscribeToTable(
  table: "messages" | "projects" | "requests" | string,
  options: SubscribeOptions = {},
): string | null {
  if (!SUPABASE_READY) {
    logger.info(`[Realtime] mock mode — no subscribe for ${table}`);
    return null;
  }

  // Compose tenant-safe filter to prevent cross-org leaks
  let finalFilter = options.filter;
  const tenantParts: string[] = [];
  if (options.orgId) tenantParts.push(`organization_id=eq.${options.orgId}`);
  if (options.workspaceId) tenantParts.push(`workspace_id=eq.${options.workspaceId}`);
  if (tenantParts.length) {
    const tenantFilter = tenantParts.join(" and ");
    finalFilter = finalFilter ? `${finalFilter} and ${tenantFilter}` : tenantFilter;
  }

  const key = makeKey(table, finalFilter || options.filter);
  if (activeSubscriptions.has(key)) {
    logger.info(`[Realtime] already subscribed to ${key}`);
    return key;
  }

  const channel = supabase
    .channel(`realtime:${key}`)
    .on(
      "postgres_changes" as const,
      {
        event: options.event || "*",
        schema: "public",
        table,
        filter: finalFilter,
      },
      (payload: ChangePayload) => {
        if (options.onChange) options.onChange(payload);
        if (payload.eventType === "INSERT" && options.onInsert) options.onInsert(payload.new);
        if (payload.eventType === "UPDATE" && options.onUpdate) options.onUpdate(payload.new);
        if (payload.eventType === "DELETE" && options.onDelete) options.onDelete(payload.old);
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        logger.info(`[Realtime] subscribed to ${key}`);
      } else if (status === "CHANNEL_ERROR") {
        logger.warn(`[Realtime] error on ${key}`);
      }
    });

  activeSubscriptions.set(key, { channel, table });
  return key;
}

export function unsubscribe(subKey: string): void {
  const sub = activeSubscriptions.get(subKey);
  if (sub) {
    supabase.removeChannel(sub.channel);
    activeSubscriptions.delete(subKey);
    logger.info(`[Realtime] unsubscribed ${subKey}`);
  }
}

export function unsubscribeAll(): void {
  for (const [key, sub] of activeSubscriptions) {
    supabase.removeChannel(sub.channel);
    logger.info(`[Realtime] cleanup ${key}`);
  }
  activeSubscriptions.clear();
}

// Re-export for convenience in repos
export const realtime = {
  subscribeToTable,
  unsubscribe,
  unsubscribeAll,
};
