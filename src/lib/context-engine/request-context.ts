/**
 * AI Context Orchestration Layer - Request Context
 * Per-request context extraction and enrichment.
 */

export class RequestContext {
  extract(req: any): any {
    return {
      tenantId: req.headers?.["x-tenant-id"] || req.tenantId,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    };
  }
}

export const requestContext = new RequestContext();
