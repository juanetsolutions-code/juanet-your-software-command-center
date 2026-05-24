/**
 * Assistant Permissions - Enforces what the assistant can do per tenant/role.
 */

import type { AIContext } from "../ai-types";

export function canUseTool(toolName: string, context: AIContext): boolean {
  // Basic permission mapping
  const allowedTools = context.permissions || [];

  if (allowedTools.includes("*")) return true;
  if (allowedTools.includes(toolName)) return true;

  // Default safe tools
  const safeTools = ["get_project_status", "list_workspaces"];
  return safeTools.includes(toolName);
}

export function validateAssistantRequest(context: AIContext): boolean {
  if (!context.tenantId) return false;
  if (!context.permissions || context.permissions.length === 0) {
    // Default to very restricted
    return false;
  }
  return true;
}
