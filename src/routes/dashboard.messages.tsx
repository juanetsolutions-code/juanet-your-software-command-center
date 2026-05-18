import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ConversationList } from "@/components/dashboard/ConversationList";
import { MessageThread } from "@/components/dashboard/MessageThread";
import {
  listConversations,
  listMessages,
  sendMessage,
  type Conversation,
} from "@/lib/dashboard";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const conversations = listConversations();
  const [active, setActive] = useState<Conversation>(conversations[0]);
  const messages = useMemo(() => listMessages(active.id), [active.id]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with your project team in real time.
        </p>
      </header>

      <div className="glass rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[520px]">
        <ConversationList
          conversations={conversations}
          activeId={active.id}
          onSelect={setActive}
        />
        <MessageThread
          conversation={active}
          messages={messages}
          onSend={(text) => sendMessage(active.id, text)}
        />
      </div>
    </div>
  );
}
