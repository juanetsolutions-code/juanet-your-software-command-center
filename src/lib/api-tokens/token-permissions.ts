/**
 * Token Permissions
 */

export function hasTokenPermission(token: any, permission: string): boolean {
  return token.permissions.includes(permission) || token.permissions.includes("*");
}
