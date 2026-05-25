/**
 * Autonomous Agent Infrastructure - Agent Types
 * Core type definitions for agents, roles, permissions, and tasks.
 */

export type AgentRole = "general" | "ops" | "billing" | "support" | "admin" | "analyst";

export interface AgentDefinition {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: string[];
  permissions: string[];
  tenantId?: string; // null = platform agent
}

export interface AgentPermission {
  action: string;
  tenantId: string; // '*' for all
  conditions?: Record<string, any>;
}

export interface AgentStateSnapshot {
  agentId: string;
  tenantId: string;
  currentTask?: string;
  memoryRefs: string[];
  lastUpdated: string;
  metadata: Record<string, any>;
}

export interface AgentTask {
  id: string;
  type: string;
  payload: any;
  priority: number;
  tenantId: string;
}
