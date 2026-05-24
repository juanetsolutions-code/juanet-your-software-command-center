/**
 * Extension Registry
 * Central registry for third-party and custom extensions/plugins.
 */

export interface Extension {
  id: string;
  name: string;
  version: string;
  tenantId?: string; // null = global
  enabled: boolean;
  permissions: string[];
}

const registry = new Map<string, Extension>();

export function registerExtension(ext: Extension) {
  registry.set(ext.id, ext);
}

export function getExtension(id: string): Extension | undefined {
  return registry.get(id);
}

export function listExtensions(tenantId?: string): Extension[] {
  return Array.from(registry.values()).filter(
    (e) => !tenantId || e.tenantId === tenantId || !e.tenantId,
  );
}
