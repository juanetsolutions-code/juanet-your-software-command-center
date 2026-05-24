/**
 * Extension Permissions
 * Scopes what extensions can access per tenant.
 */

export type ExtensionPermission = "read_projects" | "write_requests" | "read_messages" | "call_ai";

export function validateExtensionPermissions(
  extensionId: string,
  requested: string[],
  tenantPermissions: string[],
): boolean {
  return requested.every((perm) => tenantPermissions.includes(perm as any));
}
