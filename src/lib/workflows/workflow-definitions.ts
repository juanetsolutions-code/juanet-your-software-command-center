/**
 * Workflow Types
 */

export interface WorkflowDefinition {
  id: string;
  tenantId?: string;
  name: string;
  steps: WorkflowStep[];
  onFailure?: 'retry' | 'fail' | 'compensate';
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay';
  config: Record<string, any>;
  nextOnSuccess?: string;
  nextOnFailure?: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  tenantId: string;
  status: 'running' | 'completed' | 'failed';
  currentStep?: string;
  startedAt: string;
  completedAt?: string;
  error?: string;
  context: Record<string, any>;
}
