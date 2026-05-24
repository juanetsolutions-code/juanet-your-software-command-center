/**
 * Logo Storage (preparation for file handling)
 */

export interface LogoAsset {
  tenantId: string;
  url: string;
  uploadedAt: string;
}

const logos = new Map<string, LogoAsset>();

export function uploadLogo(tenantId: string, url: string): LogoAsset {
  const asset: LogoAsset = {
    tenantId,
    url,
    uploadedAt: new Date().toISOString(),
  };
  logos.set(tenantId, asset);
  return asset;
}

export function getLogo(tenantId: string): LogoAsset | undefined {
  return logos.get(tenantId);
}
