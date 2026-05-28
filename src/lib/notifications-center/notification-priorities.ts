import type { Notification } from "@/lib/activity/notifications";

export type NotificationPriority = "critical" | "high" | "medium" | "low" | "info";

export const PRIORITY_CONFIG: Record<
  NotificationPriority,
  { label: string; timeout: number | null }
> = {
  critical: { label: "Critical", timeout: null },
  high: { label: "High", timeout: 0 },
  medium: { label: "Medium", timeout: 5000 },
  low: { label: "Low", timeout: 3000 },
  info: { label: "Info", timeout: 2000 },
};

export function determinePriority(notification: Notification): NotificationPriority {
  if (notification.type === "error" || notification.title.includes("failed")) {
    return "critical";
  }
  if (notification.type === "warning" || notification.unread) {
    return "high";
  }
  return "medium";
}

export function getPriorityTimeout(priority: NotificationPriority): number | null {
  return PRIORITY_CONFIG[priority].timeout;
}
