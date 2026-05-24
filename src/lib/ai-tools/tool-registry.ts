/**
 * Tool Registry - Central registry of available tools for AI agents.
 * Only registers safe, permission-scoped tools.
 */

import type { ToolDefinition } from './tool-types';

const registeredTools: Map<string, ToolDefinition> = new Map();

export function registerTool(tool: ToolDefinition): void {
  registeredTools.set(tool.name, tool);
}

export function getTool(name: string): ToolDefinition | undefined {
  return registeredTools.get(name);
}

export function listAvailableTools(): ToolDefinition[] {
  return Array.from(registeredTools.values());
}

export function getToolsForRole(role: string): ToolDefinition[] {
  return Array.from(registeredTools.values()).filter(t => 
    t.safeForAgentRoles.includes(role) || t.safeForAgentRoles.includes('*')
  );
}

// Register built-in safe tools (defined in built-in-tools.ts)
export function initializeBuiltInTools() {
  // Will be populated from built-in-tools
}
