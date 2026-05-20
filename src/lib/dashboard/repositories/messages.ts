import { supabase } from "@/lib/supabase/client";
import { SUPABASE_READY } from "@/lib/supabase/status";
import { logger } from "@/lib/utils/logger";
import { TABLES } from "@/lib/supabase/schema";
import { toConversation, toMessage } from "@/lib/supabase/mappers";
import type { Conversation, Message } from "@/lib/dashboard/types";
import { mockConversations, mockMessagesByConversation } from "@/lib/dashboard/mock";

export async function listConversations(): Promise<Conversation[]> {
  if (!SUPABASE_READY) {
    return mockConversations;
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.conversations)
      .select("*")
      .order("last_message_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) =>
      toConversation(row, { preview: "", unread: 0, online: false }),
    );
  } catch (err) {
    logger.error("Failed to fetch conversations", err);
    return mockConversations;
  }
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  if (!SUPABASE_READY) {
    return mockMessagesByConversation[conversationId] ?? [];
  }

  try {
    const { data, error } = await supabase
      .from(TABLES.messages)
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []).map((m) => toMessage(m, "current-user"));
  } catch (err) {
    logger.error("Failed to fetch messages", err);
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
    const { error } = await supabase.from(TABLES.messages).insert({
      conversation_id: conversationId,
      text,
      author_profile_id: authorProfileId,
    });
    if (error) throw error;
  } catch (err) {
    logger.error("Failed to send message", err);
  }
}
