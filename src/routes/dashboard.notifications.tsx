import { createFileRoute } from "@tanstack/react-router";
import { Bell, ArrowLeft, Check, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { NoNotificationsState } from "@/components/states/NoNotificationsState";
import {
  listMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/client-dashboard";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return `${Math.floor(d)}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

function NotificationsPage() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: listMyNotifications,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["notifications"] });

  const readOne = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidate,
  });
  const readAll = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidate,
  });

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">All your recent activity and updates.</p>
        </div>
      </header>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Unread ({unread})</span>
          <button
            onClick={() => readAll.mutate()}
            disabled={unread === 0 || readAll.isPending}
            className="text-xs text-brand-cyan hover:underline disabled:opacity-50"
          >
            Mark all read
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <NoNotificationsState />
        ) : (
          <ul className="space-y-1">
            {items.map((n) => (
              <li
                key={n.id}
                className={`p-3 rounded-lg border border-white/5 ${n.read ? "opacity-60" : "bg-white/[0.03]"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    {n.body && <div className="text-xs text-muted-foreground">{n.body}</div>}
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {timeAgo(n.createdAt)} · {n.category ?? "system"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!n.read && (
                      <button
                        onClick={() => readOne.mutate(n.id)}
                        className="p-1.5 rounded hover:bg-white/5"
                        aria-label="Mark read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => remove.mutate(n.id)}
                      className="p-1.5 rounded hover:bg-white/5"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
