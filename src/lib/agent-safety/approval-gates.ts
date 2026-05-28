import type { AgentTask } from "../agent-swarm/agent-types";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ApprovalRequest = {
  id: string;
  taskId: string;
  tenantId: string;
  status: ApprovalStatus;
  requestedAt: string;
  approvedAt?: string;
};

export class ApprovalGates {
  private requests: Map<string, ApprovalRequest> = new Map();

  requiresApproval(task: AgentTask, autonomyLevel: string): boolean {
    if (autonomyLevel === "auto") return false;
    if (autonomyLevel === "off") return false;

    const approvalTypes = ["send_reminder", "update_stage", "assign_lead"];
    return autonomyLevel === "semi_auto" && approvalTypes.includes(task.type);
  }

  request(task: AgentTask): ApprovalRequest {
    const request: ApprovalRequest = {
      id: `appr_${Date.now()}`,
      taskId: task.id,
      tenantId: task.tenantId,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);
    return request;
  }

  approve(requestId: string): boolean {
    const request = this.requests.get(requestId);
    if (!request) return false;

    request.status = "approved";
    request.approvedAt = new Date().toISOString();
    return true;
  }

  reject(requestId: string): boolean {
    const request = this.requests.get(requestId);
    if (!request) return false;

    request.status = "rejected";
    return true;
  }
}