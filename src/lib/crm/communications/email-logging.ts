import type { Contact } from "../core/crm-entities";
import type { CrmActivity } from "../core/crm-entities";

export type Communication = {
  id: string;
  tenantId: string;
  contactId: string;
  type: "email" | "call" | "meeting";
  subject: string;
  body?: string;
  timestamp: string;
  direction: "inbound" | "outbound";
};

export class EmailLogging {
  private emails: Map<string, Communication> = new Map();

  log(tenantId: string, contactId: string, subject: string, body?: string): Communication {
    const comm: Communication = {
      id: `email_${Date.now()}`,
      tenantId,
      contactId,
      type: "email",
      subject,
      body,
      timestamp: new Date().toISOString(),
      direction: "outbound",
    };
    this.emails.set(comm.id, comm);
    return comm;
  }

  getByContact(tenantId: string, contactId: string): Communication[] {
    return Array.from(this.emails.values()).filter(
      (e) => e.tenantId === tenantId && e.contactId === contactId
    );
  }
}

export const emailLogging = new EmailLogging();