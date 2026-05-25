/**
 * Approval Management Infrastructure - Types
 */
export interface ApprovalRequest {
  id: string;
  tenantId: string;
  subject: string;
  approvers: string[];
  status: "pending" | "approved" | "rejected" | "escalated";
  createdAt: string;
}
