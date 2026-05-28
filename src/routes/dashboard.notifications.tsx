import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, Trash2, ArrowLeft } from "lucide-react";
import { NoNotificationsState } from "@/components/states/NoNotificationsState";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const mockNotifications = [
  {
    id: "n-1",
    title: "New message from Marcus",
    description: "Pushed the new auth flow to staging",
    time: "12m ago",
    read: false,
    type: "message",
  },
  {
    id: "n-2",
    title: "Invoice due soon",
    description: "INV-1048 for $8,400 is due May 22",
    time: "1h ago",
    read: false,
    type: "warning",
  },
  {
    id: "n-3",
    title: "Payment received",
    description: "INV-1047 paid via M-Pesa",
    time: "3h ago",
    read: true,
    type: "success",
  },
  {
    id: "n-4",
    title: "License issued",
    description: "Pulse CRM key issued",
    time: "Yesterday",
    read: true,
    type: "info",
  },
];

function NotificationsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All your recent activity and updates.
          </p>
        </div>
      </header>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Unread (2)</span>
          <button className="text-xs text-brand-cyan hover:underline">Mark all read</button>
        </div>

        {mockNotifications.length === 0 ? (
          <NoNotificationsState />
        ) : (
          <ul className="space-y-1">
            {mockNotifications.map((n) => (
              <li
                key={n.id}
                className={`p-3 rounded-lg border border-white/5 ${n.read ? "opacity-60" : "bg-white/[0.03]"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-cyan" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.description}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
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
