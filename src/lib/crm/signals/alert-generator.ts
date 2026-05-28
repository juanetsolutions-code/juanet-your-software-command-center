import type { Signal } from "./signal-engine";
import { emitEvent } from "@/lib/event-bus";

export type Alert = {
  id: string;
  signalId: string;
  tenantId: string;
  title: string;
  message: string;
  channel: "in_app" | "email" | "slack";
  sentAt?: string;
};

export class AlertGenerator {
  async createFromSignal(signal: Signal, tenantId: string): Promise<Alert> {
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      signalId: signal.id,
      tenantId,
      title: `${signal.type.replace("_", " ")} detected`,
      message: signal.message,
      channel: "in_app",
    };
    
    emitEvent({
      id: `evt_${Date.now()}`,
      type: `crm.alert.${signal.type}`,
      tenantId,
      timestamp: new Date().toISOString(),
      payload: { alertId: alert.id, signalId: signal.id, entityId: signal.entityId },
      version: "1.0",
    });
    
    return alert;
  }
}

export const alertGenerator = new AlertGenerator();