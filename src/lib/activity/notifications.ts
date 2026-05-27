/**
 * Notifications - User-facing notifications
 */

export type NotificationType = "info" | "success" | "warning" | "error";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description?: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n-1",
    type: "info",
    title: "New message from Marcus",
    description: "Pushed the new auth flow to staging",
    timestamp: "2026-05-27T22:00:00Z",
    read: false,
    link: "/dashboard/messages",
  },
  {
    id: "n-2",
    type: "warning",
    title: "Invoice due soon",
    description: "INV-1048 for $8,400 is due May 22",
    timestamp: "2026-05-27T10:00:00Z",
    read: false,
    link: "/dashboard/payments",
  },
  {
    id: "n-3",
    type: "success",
    title: "Payment received",
    description: "INV-1047 paid via M-Pesa",
    timestamp: "2026-05-26T15:00:00Z",
    read: true,
    link: "/dashboard/payments",
  },
];

export function listNotifications(): Notification[] {
  return [...mockNotifications];
}

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

export function markAsRead(id: string): void {
  const notif = mockNotifications.find((n) => n.id === id);
  if (notif) notif.read = true;
}

export function markAllAsRead(): void {
  mockNotifications.forEach((n) => (n.read = true));
}

export function createNotification(
  notification: Omit<Notification, "id" | "timestamp" | "read">,
): Notification {
  const newNotif: Notification = {
    ...notification,
    id: `n-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
  mockNotifications.unshift(newNotif);
  return newNotif;
}
