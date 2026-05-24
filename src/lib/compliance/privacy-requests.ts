/**
 * Privacy Requests Handler
 */

export interface PrivacyRequest {
  type: "access" | "deletion" | "portability";
  tenantId: string;
  userId: string;
  status: string;
}

const requests: PrivacyRequest[] = [];

export function submitPrivacyRequest(req: Omit<PrivacyRequest, "status">): PrivacyRequest {
  const full: PrivacyRequest = { ...req, status: "received" };
  requests.push(full);
  return full;
}
