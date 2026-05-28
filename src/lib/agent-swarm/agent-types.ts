import type { DomainEvent } from "../event-bus/event-bus";

export type AgentStatus = "idle" | "running" | "error" | "shutdown";
export type AgentType = "sales" | "support" | "analytics" | "outreach" | "optimization";

export type AgentCapability = {
  name: string;
  version: string;
  description: string;
};

export type AgentTask = {
  id: string;
  type: string;
  tenantId: string;
  priority: number;
  payload: Record<string, unknown>;
  deadline?: string;
  assignedTo?: string;
  status: "pending" | "assigned" | "in_progress" | "completed" | "failed";
  createdAt: string;
};

export type AgentInfo = {
  id: string;
  type: AgentType;
  tenantId: string;
  status: AgentStatus;
  capabilities: AgentCapability[];
  lastHeartbeat: string;
  processedTasks: number;
};

export abstract class BaseAgent {
  abstract readonly id: string;
  abstract readonly type: AgentType;
  
  get status(): AgentStatus { return this._status; }
  protected _status: AgentStatus = "idle";
  
  get capabilities(): AgentCapability[] { return []; }
  
  onEvent?(event: DomainEvent): Promise<void>;
  onTask?(task: AgentTask): Promise<void>;
  shutdown?(): Promise<void>;
  
  protected setStatus(status: AgentStatus): void {
    this._status = status;
  }
  
  protected async heartbeat(): Promise<void> {
    // Emit heartbeat event
  }
}