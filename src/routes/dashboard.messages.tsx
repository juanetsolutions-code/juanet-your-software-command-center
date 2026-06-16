import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Lock, Plus, Send, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import {
  listConversations,
  listMessages,
  sendMessage,
  startConversation,
  markConversationRead,
  type MessagingConversation,
  type MessagingMessage,
} from "@/lib/messaging";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
  }, []);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: listConversations,
    refetchInterval: 15_000,
  });

  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations]);

  useEffect(() => {
    if (activeId) {
      markConversationRead(activeId).then(() =>
        qc.invalidateQueries({ queryKey: ["conversations"] }),
      );
    }
  }, [activeId, qc]);

  const filtered = useMemo(
    () =>
      conversations.filter((c) =>
        c.subject.toLowerCase().includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            Messages
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="h-3 w-3" /> Secure
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Encrypted in transit. Only conversation participants can read messages.
          </p>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
        >
          <Plus className="h-4 w-4" /> New conversation
        </button>
      </header>

      <div className="glass rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-220px)] min-h-[520px]">
        <aside className="border-b md:border-b-0 md:border-r border-white/10 flex flex-col min-h-0">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-blue/60"
              />
            </div>
          </div>
          <ul className="flex-1 overflow-y-auto">
            {isLoading && (
              <li className="p-4 text-xs text-muted-foreground">Loading…</li>
            )}
            {!isLoading && filtered.length === 0 && (
              <li className="p-6 text-center text-xs text-muted-foreground">
                No conversations yet. Click "New conversation" to start one.
              </li>
            )}
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "w-full text-left px-3 py-3 border-b border-white/5",
                    active?.id === c.id ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium truncate">{c.subject}</span>
                    {c.unread > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-brand-blue text-[10px] grid place-items-center text-primary-foreground font-semibold">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {c.preview}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {active ? (
          <Thread conversation={active} me={me} />
        ) : (
          <div className="grid place-items-center text-sm text-muted-foreground">
            Select or start a conversation
          </div>
        )}
      </div>

      <NewConversationDialog open={newOpen} onOpenChange={setNewOpen} onCreated={(id) => setActiveId(id)} />
    </div>
  );
}

function Thread({
  conversation,
  me,
}: {
  conversation: MessagingConversation;
  me: string | null;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", conversation.id],
    queryFn: () => listMessages(conversation.id),
    refetchInterval: 5_000,
  });

  const send = useMutation({
    mutationFn: (body: string) => sendMessage(conversation.id, body),
    onSuccess: () => {
      setDraft("");
      qc.invalidateQueries({ queryKey: ["messages", conversation.id] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to send"),
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    send.mutate(draft.trim());
  }

  return (
    <section className="flex flex-col min-h-0">
      <header className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{conversation.subject}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Lock className="h-3 w-3" /> End-to-end secure
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-12">
            No messages yet — say hello!
          </div>
        )}
        {messages.map((m: MessagingMessage, i: number) => {
          const mine = m.senderId === me;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              className={cn("flex", mine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                  mine
                    ? "bg-gradient-to-br from-brand-blue to-brand-violet text-primary-foreground rounded-br-sm"
                    : "bg-white/5 border border-white/5 rounded-bl-sm",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <div className={cn("text-[10px] mt-1", mine ? "text-white/70" : "text-muted-foreground")}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <form onSubmit={submit} className="border-t border-white/10 p-3 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(e as any);
            }
          }}
          rows={1}
          placeholder="Type a secure message…"
          className="flex-1 resize-none rounded-md bg-white/5 border border-border/60 px-3 py-2 text-sm outline-none focus:border-brand-blue/60 min-h-[40px] max-h-32"
        />
        <button
          type="submit"
          disabled={!draft.trim() || send.isPending}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" /> Send
        </button>
      </form>
    </section>
  );
}

function NewConversationDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const qc = useQueryClient();
  const [subject, setSubject] = useState("");
  const [emails, setEmails] = useState("");
  const [initial, setInitial] = useState("");

  const create = useMutation({
    mutationFn: () =>
      startConversation({
        subject,
        participantEmails: emails.split(",").map((s) => s.trim()).filter(Boolean),
        initialMessage: initial,
      }),
    onSuccess: (id) => {
      toast.success("Conversation started");
      qc.invalidateQueries({ queryKey: ["conversations"] });
      onCreated(id);
      onOpenChange(false);
      setSubject("");
      setEmails("");
      setInitial("");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new secure conversation</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!subject.trim()) return;
            create.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Onboarding questions"
              className="w-full h-10 px-3 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Participant emails (comma-separated, optional)
            </label>
            <input
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="team@juanet.com, alice@acme.com"
              className="w-full h-10 px-3 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Leave blank to message support. Users must already have an account.
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">First message (optional)</label>
            <textarea
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/5 border border-border/60 text-sm outline-none focus:border-brand-cyan/50"
            />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-10 px-4 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={create.isPending}
              className="h-10 px-4 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90 disabled:opacity-50"
            >
              {create.isPending ? "Starting…" : "Start conversation"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
