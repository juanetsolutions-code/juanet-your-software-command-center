/**
 * Messaging service — Supabase-backed conversations + messages.
 * Transport-layer secure (HTTPS + RLS). Plaintext bodies in DB,
 * readable only to conversation participants via RLS.
 */
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";

export interface MessagingConversation {
  id: string;
  subject: string;
  createdBy: string;
  lastMessageAt: string;
  createdAt: string;
  // derived
  unread: number;
  preview: string;
  participantNames: string[];
}

export interface MessagingMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
}

async function uid(): Promise<string | null> {
  if (!SUPABASE_READY) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function listConversations(): Promise<MessagingConversation[]> {
  const me = await uid();
  if (!me) return [];
  // participant rows for me → conversation ids
  const { data: parts } = await supabase
    .from("conversation_participants")
    .select("conversation_id,last_read_at")
    .eq("user_id", me);
  const ids = (parts ?? []).map((p: any) => p.conversation_id);
  if (ids.length === 0) return [];
  const lastReadMap = new Map<string, string | null>(
    (parts ?? []).map((p: any) => [p.conversation_id, p.last_read_at]),
  );

  const { data: convs } = await supabase
    .from("conversations")
    .select("*")
    .in("id", ids)
    .order("last_message_at", { ascending: false });

  // last message preview + unread count
  const result: MessagingConversation[] = [];
  for (const c of convs ?? []) {
    const { data: last } = await supabase
      .from("messages")
      .select("body,created_at")
      .eq("conversation_id", c.id)
      .order("created_at", { ascending: false })
      .limit(1);
    const lastRead = lastReadMap.get(c.id);
    const unreadQ = supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("conversation_id", c.id)
      .neq("sender_id", me);
    const { count } = lastRead
      ? await unreadQ.gt("created_at", lastRead)
      : await unreadQ;
    result.push({
      id: c.id,
      subject: c.subject,
      createdBy: c.created_by,
      lastMessageAt: c.last_message_at,
      createdAt: c.created_at,
      unread: count ?? 0,
      preview: last?.[0]?.body ?? "No messages yet",
      participantNames: [],
    });
  }
  return result;
}

export async function listMessages(conversationId: string): Promise<MessagingMessage[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return (data ?? []).map((r: any) => ({
    id: r.id,
    conversationId: r.conversation_id,
    senderId: r.sender_id,
    body: r.body,
    createdAt: r.created_at,
  }));
}

export async function sendMessage(conversationId: string, body: string): Promise<void> {
  const me = await uid();
  if (!me) throw new Error("Not signed in");
  const { error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: me, body });
  if (error) throw error;
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const me = await uid();
  if (!me) return;
  await supabase
    .from("conversation_participants")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", me);
}

/** Start a conversation with one or more other users (by email). */
export async function startConversation(input: {
  subject: string;
  participantEmails: string[];
  initialMessage?: string;
}): Promise<string> {
  const me = await uid();
  if (!me) throw new Error("Not signed in");

  const { data: conv, error } = await supabase
    .from("conversations")
    .insert({ subject: input.subject || "New conversation", created_by: me })
    .select("*")
    .single();
  if (error) throw error;

  // add self
  await supabase.from("conversation_participants").insert({
    conversation_id: conv.id,
    user_id: me,
    role: "owner",
    last_read_at: new Date().toISOString(),
  });

  // resolve emails → user ids (best-effort; silently skip unresolved)
  const emails = input.participantEmails.map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (emails.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,email")
      .in("email", emails);
    for (const p of profiles ?? []) {
      if (p.id === me) continue;
      await supabase
        .from("conversation_participants")
        .insert({ conversation_id: conv.id, user_id: p.id, role: "member" });
    }
  }

  if (input.initialMessage?.trim()) {
    await sendMessage(conv.id, input.initialMessage.trim());
  }
  return conv.id;
}

/** Total unread messages across all my conversations. */
export async function getUnreadMessageCount(): Promise<number> {
  const convs = await listConversations();
  return convs.reduce((s, c) => s + c.unread, 0);
}
