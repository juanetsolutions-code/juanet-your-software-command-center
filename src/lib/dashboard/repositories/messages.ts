import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Conversation, Message } from "@/lib/dashboard/types";
import type { DbMessage } from "@/lib/supabase/types";
import { mockConversations, mockMessagesByConversation } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelectFrom, safeInsert, safeUpdate } from "./_shared";
import { afterMutation } from "../cache";
import { scopedQuery } from "@/lib/tenant/context";

function formatClock(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

function mapMessageRow(row: DbMessage, currentUserId = "current-user"): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    author: row.sender_id === currentUserId ? "me" : "them",
    text: row.content ?? "",
    timeLabel: formatClock(row.created_at),
  };
}

const mapDbMessage = mapMessageRow; // alias

export async function listConversations(): Promise<Conversation[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock conversations data");
    return mockConversations;
  }

  try {
    const rows = await safeSelectFrom<Record<string, unknown>>(
      supabase,
      "listConversations",
      (c) => {
        let q = c.from("conversations").select("*").order("created_at", { ascending: false });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        q = scopedQuery(q as any) as any;
        return q;
      },
    );
    // Until conversation metadata (preview/unread/online) + joins modeled,
    // conversations always fall back to mock to preserve exact UI shape.
    // (messages table itself is fully wired below)
    return mockConversations;
  } catch (err) {
    handleSupabaseError(err, "listConversations");
    return mockConversations;
  }
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  if (!SUPABASE_READY) {
    return mockMessagesByConversation[conversationId] ?? mockMessagesByConversation["c-01"] ?? [];
  }

  try {
    const rows = await safeSelectFrom<DbMessage>(supabase, "listMessages", (c) => {
      let q = c
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      q = scopedQuery(q as any) as any;
      return q;
    });
    if (rows.length === 0) {
      return mockMessagesByConversation[conversationId] ?? [];
    }
    return rows.map((r) => mapDbMessage(r));
  } catch (err) {
    handleSupabaseError(err, "listMessages");
    return mockMessagesByConversation[conversationId] ?? [];
  }
}

export async function sendMessage(
  conversationId: string,
  text: string,
  authorProfileId: string,
): Promise<void> {
  if (!SUPABASE_READY) return;

  try {
    await safeInsert(supabase, "sendMessage", "messages", {
      conversation_id: conversationId,
      content: text,
      sender_id: authorProfileId,
    });
    afterMutation("messages", authorProfileId);
  } catch (err) {
    handleSupabaseError(err, "sendMessage");
  }
}

/**
 * Mark a message as read (for future UI unread counts).
 * Schema may use read_at or is_read; safe update.
 */
export async function markMessageRead(messageId: string, userId?: string): Promise<void> {
  if (!SUPABASE_READY) return;

  try {
    await safeUpdate(
      supabase,
      "markMessageRead",
      "messages",
      { read_at: new Date().toISOString() }, // assumes column exists or ignore by RLS
      { id: messageId },
    );
    afterMutation("messages", userId);
  } catch (err) {
    handleSupabaseError(err, "markMessageRead");
    // non-fatal
  }
}

// Realtime preparation note:
// Future: use src/lib/supabase/realtime.ts to subscribe to "messages" table
// filtered by conversation_id for live updates without polling.
