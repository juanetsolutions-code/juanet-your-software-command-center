/**
 * Automation Context
 * Provides isolated, tenant-safe execution context for automations and workflows.
 * Includes user, tenant, and payload information.
 */

export interface AutomationContext {
  tenantId: string;
  userId?: string;
  workspaceId?: string;
  permissions?: string[];
  payload?: Record<string, any>;
  automationId?: string;
  triggeredAt: string;
}

export function createAutomationContext(
  tenantId: string,
  overrides: Partial<AutomationContext> = {}
): AutomationContext {
  return {
    tenantId,
    triggeredAt: new Date().toISOString(),
    ...overrides,
  };
}
