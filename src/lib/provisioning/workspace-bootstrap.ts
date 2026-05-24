/**
 * Workspace Bootstrap
 * Creates default workspaces and structure for new tenants.
 */

export function bootstrapDefaultWorkspace(organizationId: string) {
  return {
    id: `ws_${organizationId}_default`,
    name: "Main Workspace",
    organizationId,
    isDefault: true,
  };
}
