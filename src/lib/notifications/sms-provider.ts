/**
 * SMS Provider Abstraction
 */

export interface SmsMessage {
  to: string;
  body: string;
  tenantId: string;
}

export interface SmsProvider {
  send(message: SmsMessage): Promise<{ success: boolean; providerId?: string }>;
}

export class TwilioSmsProvider implements SmsProvider {
  async send(message: SmsMessage): Promise<{ success: boolean; providerId?: string }> {
    return { success: true, providerId: `sms-${Date.now()}` };
  }
}

export const smsProvider: SmsProvider = new TwilioSmsProvider();
