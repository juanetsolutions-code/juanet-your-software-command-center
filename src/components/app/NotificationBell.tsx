import { Bell, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  listMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/client-dashboard";

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return `${Math.floor(d)}s`;
  if (d < 3600) return `${Math.floor(d / 60)}m`;
  if (d < 86400) return `${Math.floor(d / 3600)}h`;
  return `${Math.floor(d / 86400)}d`;
}

export function NotificationBell({ basePath }: { basePath: "/dashboard" | "/admin" }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: listMyNotifications,
    refetchInterval: 30_000,
  });
  const unread = items.filter((n) => !n.read).length;
  const recent = items.slice(0, 6);

  const readOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const readAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const inboxPath = basePath === "/dashboard" ? "/dashboard/notifications" : "/admin/audit-center";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-white/5"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-cyan" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
          <span className="text-sm font-medium">
            Notifications {unread > 0 && <span className="text-muted-foreground">({unread})</span>}
          </span>
          <button
            disabled={unread === 0}
            onClick={() => readAll.mutate()}
            className="text-[11px] text-brand-cyan hover:underline disabled:opacity-40"
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {recent.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-muted-foreground">
              You're all caught up.
            </li>
          )}
          {recent.map((n) => (
            <li
              key={n.id}
              className={`px-3 py-2.5 border-b border-border/40 flex items-start gap-2 hover:bg-white/5 cursor-pointer ${
                n.read ? "opacity-60" : ""
              }`}
              onClick={() => {
                if (!n.read) readOne.mutate(n.id);
                if (n.link) navigate({ to: n.link });
              }}
            >
              <span
                className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                  n.read ? "bg-transparent" : "bg-brand-cyan"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{n.title}</div>
                {n.body && (
                  <div className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</div>
                )}
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {timeAgo(n.createdAt)} ago
                </div>
              </div>
              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    readOne.mutate(n.id);
                  }}
                  className="p-1 rounded hover:bg-white/10"
                  aria-label="Mark read"
                >
                  <Check className="h-3 w-3" />
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="px-3 py-2 border-t border-border/60">
          <button
            onClick={() => navigate({ to: inboxPath })}
            className="w-full text-xs text-center text-brand-cyan hover:underline"
          >
            View all notifications
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
