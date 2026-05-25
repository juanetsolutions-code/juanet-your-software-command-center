/**
 * Connector SDK - Event System
 * Defines standard events that connectors can emit for observability and integration.
 */

export interface ConnectorEvent {
  id: string;
  connectorId: string;
  tenantId: string;
  type: string;
  payload: Record<string, any>;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ConnectorEventType =
  | "connection_established"
  | "connection_lost"
  | "sync_started"
  | "sync_completed"
  | "sync_failed"
  | "data_received"
  | "data_sent"
  | "error"
  | "health_check";

export class ConnectorEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(eventType: string, listener: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  emit(event: ConnectorEvent): void {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`[ConnectorEvent] Listener error for ${event.type}:`, error);
      }
    });
  }

  createEvent(
    connectorId: string,
    tenantId: string,
    type: ConnectorEventType,
    payload: Record<string, any>,
  ): ConnectorEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      connectorId,
      tenantId,
      type,
      payload,
      timestamp: new Date().toISOString(),
    };
  }
}
