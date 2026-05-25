/**
 * Marketplace Runtime
 * Core runtime for discovering, installing, and running marketplace extensions.
 */

export interface MarketplaceExtension {
  id: string;
  name: string;
  version: string;
  tenantId?: string;
  status: "available" | "installed" | "disabled";
}

export class MarketplaceRuntime {
  private extensions: MarketplaceExtension[] = [];

  discover(tenantId: string): MarketplaceExtension[] {
    return this.extensions.filter((e) => !e.tenantId || e.tenantId === tenantId);
  }

  install(tenantId: string, extensionId: string): MarketplaceExtension {
    const ext: MarketplaceExtension = {
      id: extensionId,
      name: `Extension ${extensionId}`,
      version: "1.0.0",
      tenantId,
      status: "installed",
    };
    this.extensions.push(ext);
    return ext;
  }
}

export const marketplaceRuntime = new MarketplaceRuntime();
