/**
 * Tool Executor - Safely executes tool calls from AI agents.
 * All executions go through existing backend adapters (automation, notifications, etc.).
 * Never direct DB or UI access.
 */

import type { ToolCall, ToolResult } from "./tool-types";
import { getTool } from "./tool-registry";

export async function executeToolCall(
  call: ToolCall,
  context: { tenantId: string; userId?: string; permissions: string[] },
): Promise<ToolResult> {
  const start = Date.now();
  const toolDef = getTool(call.tool);

  if (!toolDef) {
    return {
      success: false,
      error: `Tool ${call.tool} not registered`,
      executionTimeMs: Date.now() - start,
    };
  }

  // Permission check
  const hasPerm = toolDef.requiredPermissions.every(
    (p) => context.permissions.includes(p) || context.permissions.includes("*"),
  );
  if (!hasPerm) {
    return {
      success: false,
      error: `Insufficient permissions for tool ${call.tool}`,
      executionTimeMs: Date.now() - start,
    };
  }

  // Delegate to safe adapters (existing systems)
  try {
    let result: any;

    switch (call.tool) {
      case "createInvoice":
        // Safe stub adapter (integrates with billing in full impl)
        result = { invoiceId: "AI-INV-" + Date.now(), ...call.parameters };
        break;

      case "sendNotification":
        // Adapter to existing notification-service (backend only)
        const { notificationService } = await import("@/lib/services/notification-service");
        result = await notificationService.onAutomationEvent("tool_send_notification", {
          ...call.parameters,
          tenantId: context.tenantId,
        });
        break;

      case "triggerWorkflow":
        // Adapter to automation engine (previous phase)
        const { automationEngine } = await import("@/lib/automation/engine");
        const aiContext = {
          tenantId: context.tenantId,
          userId: context.userId,
          triggeredAt: new Date().toISOString(),
        };
        result = await automationEngine.trigger(
          call.parameters.eventType || "ai_tool_trigger",
          call.parameters,
          aiContext as any,
        );
        break;

      case "queryMetrics":
        // Safe read via existing observability/monitoring
        const { getSystemStatus } = await import("@/lib/observability/system-status");
        result = await getSystemStatus();
        break;

      default:
        result = { message: "Tool executed (stub)" };
    }

    return {
      success: true,
      data: result,
      executionTimeMs: Date.now() - start,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Tool execution failed",
      executionTimeMs: Date.now() - start,
    };
  }
}
