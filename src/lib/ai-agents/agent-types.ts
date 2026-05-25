/**
 * AI Agent Core Types
 * Defines the foundational types for the AI Agent Framework.
 * This is the base for all autonomous agents in Juanet.
 */

export type AgentRole = "admin" | "finance" | "support" | "ops" | "custom";

export type AgentMode = "stateless" | "stateful";

export interface AgentConfig {
  id: string;
  tenantId: string;
  role: AgentRole;
  mode: AgentMode;
  name: string;
  description?: string;
  allowedTools: string[];
  maxIterations?: number;
  temperature?: number;
}

export interface AgentState {
  agentId: string;
  tenantId: string;
  conversationHistory: Array<{ role: "user" | "assistant" | "tool"; content: string }>;
  context: Record<string, any>;
  lastActivity: string;
}

export interface AgentExecutionResult {
  success: boolean;
  output?: string;
  actionsTaken: string[];
  error?: string;
  confidence?: number;
  reasoningTrace?: string[];
  plannedTools?: AgentToolCall[]; // Agents can return tools to execute in the runtime loop
}

export interface AgentToolCall {
  tool: string; // align with ToolCall in ai-tools
  parameters: Record<string, any>;
  reason: string;
}
