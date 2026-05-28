import type { AgentAction } from "../sales-agent-orchestrator";

export type ApprovalRequest = {
  actionId: string;
  action: AgentAction;
  requestedBy?: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
};

export class HumanApprovalGate {
  private requests: Map<string, ApprovalRequest> = new Map();

  request(action: AgentAction, userId?: string): ApprovalRequest {
    const req: ApprovalRequest = {
      actionId: action.id,
      action,
      requestedBy: userId,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    
    this.requests.set(action.id, req);
    return req;
  }

  approve(actionId: string, approver: string): boolean {
    const req = this.requests.get(actionId);
    if (!req) return false;
    
    req.status = "approved";
    return true;
  }

  reject(actionId: string, reason: string): boolean {
    const req = this.requests.get(actionId);
    if (!req) return false;
    
    req.status = "rejected";
    return true;
  }

  getPending(tenantId?: string): ApprovalRequest[] {
    return Array.from(this.requests.values()).filter(
      (r) => r.status === "pending"
    );
  }
}

export const humanApprovalGate = new HumanApprovalGate();