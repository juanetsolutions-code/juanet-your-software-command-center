export type CollaborationAction = "view" | "edit" | "comment" | "admin";

interface PermissionEntry {
  userId: string;
  resource: string;
  actions: CollaborationAction[];
}

const perms: PermissionEntry[] = [];

export function grantPermission(entry: PermissionEntry) {
  perms.push(entry);
}

export function canPerform(userId: string, resource: string, action: CollaborationAction): boolean {
  return perms.some(
    (p) => p.userId === userId && p.resource === resource && p.actions.includes(action),
  );
}

export function revokePermissions(userId: string, resource: string) {
  for (let i = perms.length - 1; i >= 0; i--) {
    if (perms[i].userId === userId && perms[i].resource === resource) perms.splice(i, 1);
  }
}
