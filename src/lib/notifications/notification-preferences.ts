/**
 * Notification Preferences
 * Tenant and user level notification preference management.
 */

export interface NotificationPreference {
  tenantId: string;
  userId?: string;
  channel: string;
  enabled: boolean;
  categories: string[];
}

export class NotificationPreferences {
  private prefs: NotificationPreference[] = [];

  setPreference(pref: NotificationPreference): void {
    const existing = this.prefs.findIndex(
      (p) => p.tenantId === pref.tenantId && p.userId === pref.userId && p.channel === pref.channel,
    );
    if (existing >= 0) this.prefs[existing] = pref;
    else this.prefs.push(pref);
  }

  isEnabled(tenantId: string, channel: string, category: string, userId?: string): boolean {
    const pref = this.prefs.find(
      (p) => p.tenantId === tenantId && p.channel === channel && (!userId || p.userId === userId),
    );
    return !pref || (pref.enabled && pref.categories.includes(category));
  }
}

export const notificationPreferences = new NotificationPreferences();
