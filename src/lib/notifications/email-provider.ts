/**
 * Email Provider Abstraction
 * Pluggable email delivery provider interface.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  tenantId: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<{ success: boolean; providerId?: string }>;
}

export class SmtpEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<{ success: boolean; providerId?: string }> {
    // Stub implementation
    return { success: true, providerId: `smtp-${Date.now()}` };
  }
}

export const emailProvider: EmailProvider = new SmtpEmailProvider();
