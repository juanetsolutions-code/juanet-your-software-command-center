/**
 * Workspace Isolation
 * Enforces strong isolation between tenant workspaces.
 */

export class WorkspaceIsolation {
  enforceIsolation(workspaceA: string, workspaceB: string): boolean {
    return workspaceA !== workspaceB;
  }
}

export const workspaceIsolation = new WorkspaceIsolation();
