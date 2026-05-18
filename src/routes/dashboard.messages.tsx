import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";
import { useState } from "react";
import { conversations, sampleThread, type Conversation } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const [active, setActive] = useState<Conversation>(conversations[0]);
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with your project team in real time.
        </p>
      </header>

      <div className="glass rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[520px]">
        {/* Conversation list */}
        <aside className="border-b md:border-b-0 md:border-r border-white/10 flex flex-col min-h-0">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search conversations..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c)}
                  className={cn(
                    "w-full text-left flex items-start gap-3 px-3 py-3 border-b border-white/5 transition-colors",
                    active.id === c.id
                      ? "bg-white/[0.06]"
                      : "hover:bg-white/[0.04]",
                  )}
                >
                  <div className="relative shrink-0">
                    <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {c.role}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {c.preview}
                      </p>
                      {c.unread > 0 && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-brand-blue text-[10px] grid place-items-center text-primary-foreground font-semibold">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Thread */}
        <section className="flex flex-col min-h-0">
          <header className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
                {active.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{active.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {active.online ? "Online now" : "Offline"} • {active.role}
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
            {sampleThread.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={cn(
                  "flex",
                  m.from === "me" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                    m.from === "me"
                      ? "bg-gradient-to-br from-brand-blue to-brand-violet text-primary-foreground rounded-br-sm"
                      : "bg-white/5 border border-white/5 rounded-bl-sm",
                  )}
                >
                  <p>{m.text}</p>
                  <div
                    className={cn(
                      "mt-1 text-[10px]",
                      m.from === "me"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {m.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-3 border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
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
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5"
    >
      {children}
    </button>
  );
}
