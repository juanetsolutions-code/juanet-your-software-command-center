/**
 * Automation Types - Core types for the automation engine.
 */

export type TriggerType = "event" | "schedule" | "ai_decision" | "webhook";

export type ActionType =
  | "send_message"
  | "create_task"
  | "update_record"
  | "call_ai"
  | "webhook"
  | "email";

export interface AutomationWorkflow {
  id: string;
  tenantId: string;
  name: string;
  trigger: {
    type: TriggerType;
    config: Record<string, any>;
  };
  actions: Array<{
    type: ActionType;
    config: Record<string, any>;
    aiPrompt?: string; // for AI-assisted actions
  }>;
  enabled: boolean;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "completed" | "failed";
  triggerData: any;
  result?: any;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface AutomationDefinition {
  id: string;
  tenantId?: string; // undefined = global
  name: string;
  trigger: {
    type: "event" | "schedule" | "rule";
    eventType?: string;
    schedule?: string;
    tenantId?: string;
  };
  steps: Array<{
    action: string;
    config: Record<string, any>;
  }>;
  enabled: boolean;
}
