/**
 * Asset Storage
 * Abstracted, tenant-safe object storage layer.
 */

export interface StoredAsset {
  id: string;
  tenantId: string;
  key: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export class AssetStorage {
  private assets: StoredAsset[] = [];

  upload(tenantId: string, key: string, size: number, contentType: string): StoredAsset {
    const asset: StoredAsset = {
      id: `asset-${Date.now()}`,
      tenantId,
      key,
      size,
      contentType,
      uploadedAt: new Date().toISOString(),
    };
    this.assets.push(asset);
    return asset;
  }
}

export const assetStorage = new AssetStorage();
