import type { Notification } from "@/lib/activity/notifications";

export interface NotificationCenter {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  archive: (id: string) => void;
  clear: () => void;
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
];

export const notificationCenter: NotificationCenter = {
  notifications: [...mockNotifications],
  get unreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  },
  markAsRead: (id: string) => {
    const n = mockNotifications.find((n) => n.id === id);
    if (n) n.read = true;
  },
  markAllAsRead: () => {
    mockNotifications.forEach((n) => (n.read = true));
  },
  archive: (id: string) => {
    const idx = mockNotifications.findIndex((n) => n.id === id);
    if (idx > -1) mockNotifications.splice(idx, 1);
  },
  clear: () => {
    mockNotifications.length = 0;
  },
};
