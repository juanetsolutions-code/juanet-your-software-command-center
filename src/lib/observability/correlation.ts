/**
 * Cross-region correlation IDs for distributed observability.
 */
export interface CorrelationContext {
  correlationId: string;
  parentId?: string;
  region?: string;
  tenantId?: string;
}

export function newCorrelationId(): string {
  return crypto.randomUUID();
}

export function createCorrelationContext(partial: Partial<CorrelationContext> = {}): CorrelationContext {
  return {
    correlationId: partial.correlationId ?? newCorrelationId(),
    parentId: partial.parentId,
    region: partial.region,
    tenantId: partial.tenantId,
  };
}

export function toHeaders(ctx: CorrelationContext): Record<string, string> {
  const headers: Record<string, string> = {
    "x-correlation-id": ctx.correlationId,
  };
  if (ctx.parentId) headers["x-parent-id"] = ctx.parentId;
  if (ctx.region) headers["x-region"] = ctx.region;
  if (ctx.tenantId) headers["x-tenant-id"] = ctx.tenantId;
  return headers;
}

export function fromHeaders(headers: Headers | Record<string, string | undefined>): CorrelationContext {
  const get = (k: string): string | undefined =>
    headers instanceof Headers ? headers.get(k) ?? undefined : headers[k];
  return {
    correlationId: get("x-correlation-id") ?? newCorrelationId(),
    parentId: get("x-parent-id"),
    region: get("x-region"),
    tenantId: get("x-tenant-id"),
  };
}
