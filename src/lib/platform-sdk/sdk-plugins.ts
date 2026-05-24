import type { PlatformSDK } from "./sdk-core";

export interface SDKPlugin {
  name: string;
  version: string;
  install: (sdk: PlatformSDK) => void | Promise<void>;
}

const installed = new Map<string, SDKPlugin>();

export async function registerPlugin(sdk: PlatformSDK, plugin: SDKPlugin) {
  if (installed.has(plugin.name)) return;
  await plugin.install(sdk);
  installed.set(plugin.name, plugin);
}

export function listInstalledPlugins(): SDKPlugin[] {
  return Array.from(installed.values());
}
