/**
 * Workflow Intelligence Engine - Workflow Patterns
 * Core types and pattern detection models.
 */

export interface WorkflowExecution {
  id: string;
  tenantId: string;
  workflowId: string;
  steps: string[];
  stepDurations?: Array<{ step: string; duration: number }>;
  status: string;
  startedAt: string;
  completedAt?: string;
}

export interface DetectedPattern {
  signature: string;
  frequency: number;
  avgDuration: number;
}
