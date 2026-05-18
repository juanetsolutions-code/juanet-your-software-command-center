import { motion } from "framer-motion";
import { Paperclip, Phone, Send, Smile, Video } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/lib/dashboard";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export interface MessageThreadProps {
  conversation: Conversation;
  messages: Message[];
  onSend?: (text: string) => void;
}

export function MessageThread({ conversation, messages, onSend }: MessageThreadProps) {
  const [draft, setDraft] = useState("");

  return (
    <section className="flex flex-col min-h-0">
      <header className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
            {initials(conversation.name)}
          </span>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{conversation.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              {conversation.online ? "Online now" : "Offline"} • {conversation.role}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn>
            <Phone className="h-4 w-4" />
          </IconBtn>
          <IconBtn>
            <Video className="h-4 w-4" />
          </IconBtn>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn("flex", m.author === "me" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                m.author === "me"
                  ? "bg-gradient-to-br from-brand-blue to-brand-violet text-primary-foreground rounded-br-sm"
                  : "bg-white/5 border border-white/5 rounded-bl-sm",
              )}
            >
              <p>{m.text}</p>
              <div
                className={cn(
                  "mt-1 text-[10px]",
                  m.author === "me"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {m.timeLabel}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onSend?.(draft);
            setDraft("");
          }}
          className="flex items-center gap-2 rounded-xl bg-white/5 border border-border/60 px-2 py-1.5 focus-within:border-brand-blue/60"
        >
          <IconBtn>
            <Paperclip className="h-4 w-4" />
          </IconBtn>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 h-9 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
          <IconBtn>
            <Smile className="h-4 w-4" />
          </IconBtn>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="h-9 w-9 grid place-items-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-violet text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}

function IconBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
    >
      {children}
    </button>
  );
}
