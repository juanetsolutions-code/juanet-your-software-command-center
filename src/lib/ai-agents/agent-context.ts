/**
 * Agent Context
 * Provides tenant-aware, permission-scoped context for AI agents.
 * This is critical for safe autonomous operation.
 */

import type { AgentConfig } from './agent-types';

export interface AgentExecutionContext {
  tenantId: string;
  userId?: string;
  workspaceId?: string;
  permissions: string[];
  currentWorkflowId?: string;
  availableTools: string[];
  memorySnapshot?: Record<string, any>;
}

export function buildAgentContext(config: AgentConfig, overrides: Partial<AgentExecutionContext> = {}): AgentExecutionContext {
  return {
    tenantId: config.tenantId,
    permissions: config.allowedTools, // Tools double as permission scope
    availableTools: config.allowedTools,
    ...overrides,
  };
}

export function validateAgentContext(context: AgentExecutionContext, requiredPermission: string): boolean {
  return context.permissions.includes(requiredPermission) || context.permissions.includes('*');
}
