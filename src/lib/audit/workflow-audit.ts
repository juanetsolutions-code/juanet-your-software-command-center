/**
 * Workflow Audit
 * Audit trail for all workflow execution and automation events.
 */

export interface WorkflowAuditEntry {
  id: string;
  tenantId: string;
  executionId: string;
  workflowId: string;
  step: string;
  status: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export class WorkflowAudit {
  private log: WorkflowAuditEntry[] = [];

  record(entry: Omit<WorkflowAuditEntry, "id" | "timestamp">): WorkflowAuditEntry {
    const full: WorkflowAuditEntry = {
      ...entry,
      id: `wf-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.log.push(full);
    return full;
  }
}

export const workflowAudit = new WorkflowAudit();
