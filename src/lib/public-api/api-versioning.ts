/**
 * API Versioning
 */

export const SUPPORTED_VERSIONS = ["v1", "v2"] as const;

export function resolveApiVersion(headerOrPath: string): string {
  if (headerOrPath.includes("/v2/")) return "v2";
  return "v1";
}
