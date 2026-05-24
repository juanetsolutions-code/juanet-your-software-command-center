/**
 * Workflow Context helper.
 */

export function createWorkflowContext(tenantId: string, initial: Record<string, any> = {}) {
  return {
    tenantId,
    startedAt: new Date().toISOString(),
    data: { ...initial },
  };
}
