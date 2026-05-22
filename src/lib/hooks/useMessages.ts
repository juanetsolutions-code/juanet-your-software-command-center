import { useState, useEffect } from "react";
import { app } from "@/lib/app/facade";
import type { Message, Conversation } from "@/lib/dashboard/types";

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setConversations(app.dashboard.listConversations());
      if (conversationId) {
        setMessages(app.dashboard.listMessages(conversationId));
      }
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const send = (text: string) => {
    if (conversationId) {
      app.sendMessage(conversationId, text);
    }
  };

  return { messages, conversations, loading, error, send };
}
