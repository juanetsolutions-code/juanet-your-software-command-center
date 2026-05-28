import type { CrmTask } from "./task-service";
import { taskService } from "./task-service";

export type Reminder = {
  id: string;
  taskId: string;
  tenantId: string;
  scheduledAt: string;
  deliveredAt?: string;
  channel: "email" | "in_app" | "sms";
};

export class ReminderSystem {
  private reminders: Map<string, Reminder> = new Map();

  async schedule(taskId: string, tenantId: string, minutesBefore: number, channel: "email" | "in_app"): Promise<Reminder> {
    const scheduledAt = new Date(Date.now() + minutesBefore * 60 * 1000).toISOString();
    const reminder: Reminder = {
      id: `rem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      taskId,
      tenantId,
      scheduledAt,
      channel,
    };
    this.reminders.set(reminder.id, reminder);
    return reminder;
  }

  async getPending(tenantId: string): Promise<Reminder[]> {
    const now = new Date().toISOString();
    return Array.from(this.reminders.values()).filter(
      (r) => r.tenantId === tenantId && r.scheduledAt <= now && !r.deliveredAt
    );
  }

  async markDelivered(reminderId: string): Promise<void> {
    const reminder = this.reminders.get(reminderId);
    if (reminder) {
      reminder.deliveredAt = new Date().toISOString();
      this.reminders.set(reminderId, reminder);
    }
  }

  async sendInAppNotification(reminder: Reminder, task: CrmTask): void {
    // Integration point for notifications system
    console.log(`[CRM] Reminder: ${task.title} due soon`);
  }
}

export const reminderSystem = new ReminderSystem();