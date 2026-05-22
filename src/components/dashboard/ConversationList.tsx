import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/dashboard";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

export interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  return (
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
              onClick={() => onSelect(c)}
              className={cn(
                "w-full text-left flex items-start gap-3 px-3 py-3 border-b border-white/5 transition-colors",
                activeId === c.id ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
              )}
            >
              <div className="relative shrink-0">
                <span className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
                  {initials(c.name)}
                </span>
                {c.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{c.timeLabel}</span>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">{c.role}</div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
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
  );
}
