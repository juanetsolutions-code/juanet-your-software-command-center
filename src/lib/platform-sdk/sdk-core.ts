import type { SDKContext } from "./sdk-context";

export interface PlatformSDK {
  version: string;
  context: SDKContext;
  use<T>(plugin: (sdk: PlatformSDK) => T): T;
}

export function createSDK(context: SDKContext): PlatformSDK {
  const sdk: PlatformSDK = {
    version: "1.0.0",
    context,
    use(plugin) {
      return plugin(sdk);
    },
  };
  return sdk;
}
