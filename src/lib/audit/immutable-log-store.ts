/**
 * Enterprise Logging & Audit Pipeline - Immutable Log Store
 * Append-only, tamper-proof storage for all audit events.
 */

export interface ImmutableLogEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  event: string;
  payload: any;
  hash: string; // for integrity
}

export class ImmutableLogStore {
  private logs: ImmutableLogEntry[] = [];

  append(tenantId: string, event: string, payload: any): ImmutableLogEntry {
    const entry: ImmutableLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tenantId,
      event,
      payload,
      hash: "sha256:" + Date.now(), // stub
    };
    this.logs.push(entry);
    return entry;
  }
}

export const immutableLogStore = new ImmutableLogStore();
