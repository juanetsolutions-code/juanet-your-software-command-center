/**
 * Extension Isolation
 * Tenant and process isolation for safe extension execution.
 */

export interface IsolationContext {
  tenantId: string;
  extensionId: string;
  sandboxId: string;
  resourceLimits: Record<string, number>;
}

export class ExtensionIsolation {
  createIsolation(tenantId: string, extensionId: string): IsolationContext {
    return {
      tenantId,
      extensionId,
      sandboxId: `sb-${Date.now()}`,
      resourceLimits: { memoryMb: 256, cpu: 0.5 },
    };
  }
}

export const extensionIsolation = new ExtensionIsolation();
