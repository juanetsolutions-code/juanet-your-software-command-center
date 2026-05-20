import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import type { Conversation, Message } from "@/lib/dashboard/types";
import type { DbMessage } from "@/lib/supabase/types";
import { mockConversations, mockMessagesByConversation } from "@/lib/dashboard/mock";
import { handleSupabaseError, safeSelect } from "./_shared";

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

function mapDbMessage(row: DbMessage, currentUserId = "current-user"): Message {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    author: row.sender_id === currentUserId ? "me" : "them",
    text: row.content ?? "",
    timeLabel: formatClock(row.created_at),
  };
}

export async function listConversations(): Promise<Conversation[]> {
  if (!SUPABASE_READY) {
    logger.info("[Mock Mode] Using mock conversations data");
    return mockConversations;
  }

  try {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error) throw error;

    const rows = safeSelect<Record<string, unknown>>(data);
    // Until conversation metadata (preview/unread/online) is modeled,
    // return mock to preserve UI shape.
    if (rows.length === 0) return mockConversations;
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
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    const rows = safeSelect<DbMessage>(data);
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
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      content: text,
      sender_id: authorProfileId,
    });
    if (error) throw error;
  } catch (err) {
    handleSupabaseError(err, "sendMessage");
  }
}
