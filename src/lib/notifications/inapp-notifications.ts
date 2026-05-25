/**
 * In-App Notifications
 * In-platform notification storage and delivery.
 */

export interface InAppNotification {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export class InAppNotifications {
  private store: InAppNotification[] = [];

  create(notification: Omit<InAppNotification, "id" | "read" | "createdAt">): InAppNotification {
    const full: InAppNotification = {
      ...notification,
      id: `inapp-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.store.push(full);
    return full;
  }

  markRead(id: string): void {
    const n = this.store.find((x) => x.id === id);
    if (n) n.read = true;
  }

  getUnreadForUser(tenantId: string, userId: string): InAppNotification[] {
    return this.store.filter((n) => n.tenantId === tenantId && n.userId === userId && !n.read);
  }
}

export const inAppNotifications = new InAppNotifications();
