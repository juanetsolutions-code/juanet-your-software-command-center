/**
 * AI Tools - Core types for the tool execution system.
 * Tools allow agents to interact safely with the platform backend.
 */

export type ToolName = 
  | 'createInvoice'
  | 'sendNotification'
  | 'triggerWorkflow'
  | 'queryMetrics'
  | 'updateTenantRecord'
  | 'scheduleJob';

export interface ToolDefinition {
  name: ToolName;
  description: string;
  parameters: Record<string, any>; // JSON schema like
  requiredPermissions: string[];
  safeForAgentRoles: string[];
}

export interface ToolCall {
  tool: ToolName;
  parameters: Record<string, any>;
  reason: string;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTimeMs: number;
}
