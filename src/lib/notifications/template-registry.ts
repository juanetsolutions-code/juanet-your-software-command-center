/**
 * Template Registry
 * Manages notification templates per tenant and channel.
 */

export interface NotificationTemplate {
  id: string;
  tenantId?: string;
  channel: string;
  name: string;
  subject?: string;
  body: string;
}

export class TemplateRegistry {
  private templates: NotificationTemplate[] = [];

  register(template: Omit<NotificationTemplate, "id">): NotificationTemplate {
    const full: NotificationTemplate = { ...template, id: `tpl-${Date.now()}` };
    this.templates.push(full);
    return full;
  }

  get(channel: string, name: string, tenantId?: string): NotificationTemplate | undefined {
    return this.templates.find(
      (t) =>
        t.channel === channel &&
        t.name === name &&
        (!tenantId || t.tenantId === tenantId || !t.tenantId),
    );
  }
}

export const templateRegistry = new TemplateRegistry();
