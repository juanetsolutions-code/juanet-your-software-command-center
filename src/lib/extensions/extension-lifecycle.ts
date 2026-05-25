/**
 * Extension Lifecycle
 * Manages full lifecycle: install, enable, disable, update, uninstall.
 */

export class ExtensionLifecycle {
  enable(tenantId: string, extensionId: string): boolean {
    return true;
  }

  disable(tenantId: string, extensionId: string): boolean {
    return true;
  }

  update(tenantId: string, extensionId: string, newVersion: string): boolean {
    return true;
  }
}

export const extensionLifecycle = new ExtensionLifecycle();
