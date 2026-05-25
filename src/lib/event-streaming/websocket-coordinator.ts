/**
 * WebSocket Coordinator
 * Manages WebSocket connections for real-time event delivery.
 */

export class WebSocketCoordinator {
  private connections = new Map<string, any[]>();

  register(tenantId: string, connection: any): void {
    const list = this.connections.get(tenantId) || [];
    list.push(connection);
    this.connections.set(tenantId, list);
  }

  unregister(tenantId: string, connection: any): void {
    const list = this.connections.get(tenantId) || [];
    const idx = list.indexOf(connection);
    if (idx >= 0) list.splice(idx, 1);
  }
}

export const websocketCoordinator = new WebSocketCoordinator();
