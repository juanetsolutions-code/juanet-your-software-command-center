/**
 * Permission Layer for AI agents.
 */

export function checkAgentPermission(agentRole: string, required: string, tenantPermissions: string[]): boolean {
  if (tenantPermissions.includes('*')) return true;
  return tenantPermissions.includes(required);
}
