import type { AgentAction } from "../sales-agent-orchestrator";

export type DecisionRecord = {
  id: string;
  tenantId: string;
  action: AgentAction;
  outcome: "success" | "failure" | "pending";
  executedAt: string;
  result?: Record<string, unknown>;
  feedback?: "positive" | "negative";
};

export class SalesMemoryStore {
  private decisions: Map<string, DecisionRecord> = new Map();

  store(record: DecisionRecord): void {
    this.decisions.set(record.id, record);
  }

  get(id: string): DecisionRecord | undefined {
    return this.decisions.get(id);
  }

  getByTenant(tenantId: string, limit?: number): DecisionRecord[] {
    const all = Array.from(this.decisions.values()).filter((r) => r.tenantId === tenantId);
    return limit ? all.slice(0, limit) : all;
  }

  updateFeedback(id: string, feedback: "positive" | "negative"): void {
    const record = this.decisions.get(id);
    if (record) {
      record.feedback = feedback;
      this.decisions.set(id, record);
    }
  }

  getSuccessRate(tenantId: string): number {
    const records = this.getByTenant(tenantId);
    if (records.length === 0) return 0;
    
    const successful = records.filter((r) => r.outcome === "success").length;
    return successful / records.length;
  }
}

export const salesMemory = new SalesMemoryStore();