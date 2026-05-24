import type { EdgeRegion } from "./edge-router";

export interface EdgeContext {
  region: EdgeRegion;
  requestId: string;
  tenantId?: string;
  startedAt: number;
}

export function createEdgeContext(partial: Partial<EdgeContext> = {}): EdgeContext {
  return {
    region: partial.region ?? "us-east",
    requestId: partial.requestId ?? crypto.randomUUID(),
    tenantId: partial.tenantId,
    startedAt: Date.now(),
  };
}
