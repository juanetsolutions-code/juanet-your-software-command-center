/**
 * Autonomous Agent Infrastructure - Agent Permissions
 * Fine-grained permission system for agent actions per tenant.
 */

import type { AgentPermission } from "./agent-types";

export class AgentPermissions {
  private permissions: Map<string, AgentPermission[]> = new Map();

  grant(agentId: string, permission: AgentPermission): void {
    const current = this.permissions.get(agentId) || [];
    if (!current.some((p) => p.action === permission.action)) {
      current.push(permission);
      this.permissions.set(agentId, current);
    }
  }

  canPerform(agentId: string, action: string, tenantId: string): boolean {
    const perms = this.permissions.get(agentId) || [];
    return perms.some(
      (p) => p.action === action && (p.tenantId === tenantId || p.tenantId === "*"),
    );
  }
}

export const agentPermissions = new AgentPermissions();
