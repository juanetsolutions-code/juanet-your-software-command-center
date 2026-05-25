/**
 * Enterprise Workflow Engine
 * Core type definitions for enterprise-grade workflows, states, and transitions.
 */

export type WorkflowStatus = "draft" | "active" | "paused" | "completed" | "failed" | "cancelled";

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  version: number;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: "task" | "approval" | "condition" | "parallel" | "subworkflow";
  config: Record<string, any>;
  nextSteps?: string[];
}

export interface WorkflowInstance {
  id: string;
  tenantId: string;
  definitionId: string;
  status: WorkflowStatus;
  currentStepId?: string;
  context: Record<string, any>;
  startedAt: string;
  completedAt?: string;
}
