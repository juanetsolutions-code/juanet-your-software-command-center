/**
 * Workspace Context
 * Provides isolated execution context for workspace operations.
 */

export interface WorkspaceContext {
  workspaceId: string;
  tenantId: string;
  userId?: string;
  permissions: string[];
}

export class WorkspaceContextManager {
  create(workspaceId: string, tenantId: string): WorkspaceContext {
    return {
      workspaceId,
      tenantId,
      permissions: ["read", "write", "execute"],
    };
  }
}

export const workspaceContextManager = new WorkspaceContextManager();
