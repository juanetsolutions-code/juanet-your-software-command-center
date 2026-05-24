/**
 * API Token Service
 * Secure generation and management of tenant-scoped API tokens.
 */

import { randomBytes } from "crypto";

export interface ApiToken {
  id: string;
  tenantId: string;
  token: string;
  name: string;
  permissions: string[];
  expiresAt?: string;
  createdAt: string;
  lastUsedAt?: string;
}

const tokens = new Map<string, ApiToken>();

export function generateApiToken(
  tenantId: string,
  name: string,
  permissions: string[],
  expiresInDays?: number,
): ApiToken {
  const token = `jnt_${randomBytes(32).toString("hex")}`;
  const tokenRecord: ApiToken = {
    id: `tok_${Date.now()}`,
    tenantId,
    token,
    name,
    permissions,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : undefined,
  };
  tokens.set(token, tokenRecord);
  return tokenRecord;
}

export function validateApiToken(token: string): ApiToken | null {
  const record = tokens.get(token);
  if (!record) return null;
  if (record.expiresAt && new Date(record.expiresAt) < new Date()) return null;
  return record;
}
