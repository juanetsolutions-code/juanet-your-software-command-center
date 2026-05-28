import { emitEvent } from "@/lib/event-bus";

export type UsageSignal = {
  type: "high_api_usage" | "feature_adoption" | "account_inactive" | "repeated_login";
  accountId: string;
  tenantId: string;
  value: number;
  timestamp: string;
};

export class UsageSignals {
  detectHighUsage(accountId: string, tenantId: string, apiCalls: number): UsageSignal | null {
    if (apiCalls > 1000) {
      const signal = {
        type: "high_api_usage" as const,
        accountId,
        tenantId,
        value: apiCalls,
        timestamp: new Date().toISOString(),
      };
      
      this.emitSignal(signal);
      return signal;
    }
    return null;
  }

  detectAccountInactive(accountId: string, tenantId: string, lastActive: string): UsageSignal | null {
    const days = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
    
    if (days > 30) {
      const signal = {
        type: "account_inactive" as const,
        accountId,
        tenantId,
        value: days,
        timestamp: new Date().toISOString(),
      };
      
      this.emitSignal(signal);
      return signal;
    }
    return null;
  }

  private emitSignal(signal: UsageSignal): void {
    emitEvent({
      id: `evt_${Date.now()}`,
      type: `usage.${signal.type}`,
      tenantId: signal.tenantId,
      timestamp: new Date().toISOString(),
      payload: { signal },
      version: "1.0",
    });
  }
}