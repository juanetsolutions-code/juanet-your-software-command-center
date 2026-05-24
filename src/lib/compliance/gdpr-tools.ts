/**
 * GDPR Tools
 * Foundations for data subject requests and compliance.
 */

export interface DataExportRequest {
  tenantId: string;
  userId: string;
  requestedAt: string;
  status: "pending" | "completed" | "failed";
}

const gdprRequests: DataExportRequest[] = [];

export function requestDataExport(tenantId: string, userId: string): DataExportRequest {
  const request: DataExportRequest = {
    tenantId,
    userId,
    requestedAt: new Date().toISOString(),
    status: "pending",
  };
  gdprRequests.push(request);
  return request;
}

export function getPendingGDPRRequests() {
  return gdprRequests.filter((r) => r.status === "pending");
}
