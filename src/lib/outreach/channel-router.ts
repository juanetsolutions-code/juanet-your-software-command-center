import type { GeneratedMessage } from "./message-generator";
import type { Lead } from "@/lib/crm/core/crm-entities";

export type ChannelPreference = {
  channel: "email" | "in_app" | "webhook";
  priority: number;
};

export class ChannelRouter {
  selectChannel(lead: Lead, message: GeneratedMessage): ChannelPreference {
    const preferences: ChannelPreference[] = [
      { channel: "email", priority: lead.phone ? 1 : 2 },
      { channel: "in_app", priority: lead.phone ? 2 : 1 },
    ];
    
    return preferences.sort((a, b) => a.priority - b.priority)[0];
  }

  route(lead: Lead, message: GeneratedMessage): Promise<void> {
    const channel = this.selectChannel(lead, message);
    
    switch (channel.channel) {
      case "email":
        return this.sendEmail(lead, message);
      case "in_app":
        return this.sendInApp(lead, message);
      default:
        return Promise.resolve();
    }
  }

  private async sendEmail(lead: Lead, message: GeneratedMessage): Promise<void> {
    // In production: integrate with email service
  }

  private async sendInApp(lead: Lead, message: GeneratedMessage): Promise<void> {
    // In production: integrate with notification system
  }
}