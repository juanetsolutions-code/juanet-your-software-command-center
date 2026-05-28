import type { Notification } from "@/lib/activity/notifications";

export type NotificationGroup =
  | "all"
  | "unread"
  | "system"
  | "project"
  | "message"
  | "invoice"
  | "user";

export interface NotificationGroupInfo {
  id: NotificationGroup;
  label: string;
  count?: number;
}

export const NOTIFICATION_GROUPS: NotificationGroupInfo[] = [
  { id: "all", label: "All", count: 0 },
  { id: "unread", label: "Unread", count: 0 },
  { id: "system", label: "System", count: 0 },
  { id: "project", label: "Projects", count: 0 },
  { id: "message", label: "Messages", count: 0 },
  { id: "invoice", label: "Billing", count: 0 },
  { id: "user", label: "Team", count: 0 },
];

export function groupNotifications(
  notifications: Notification[],
  group: NotificationGroup,
): Notification[] {
  if (group === "all") return notifications;
  if (group === "unread") return notifications.filter((n) => !n.read);
  return notifications.filter((n) => n.type === group);
}

export function getGroupCounts(notifications: Notification[]): Record<NotificationGroup, number> {
  return {
    all: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    system: notifications.filter((n) => n.type === "system").length,
    project: notifications.filter((n) => n.type === "project").length,
    message: notifications.filter((n) => n.type === "message").length,
    invoice: notifications.filter((n) => n.type === "invoice").length,
    user: notifications.filter((n) => n.type === "user").length,
  };
}
