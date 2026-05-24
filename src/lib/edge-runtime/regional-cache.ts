import type { EdgeRegion } from "./edge-router";

interface Entry<T> {
  value: T;
  expiresAt: number;
}

const caches = new Map<EdgeRegion, Map<string, Entry<unknown>>>();

function bucket(region: EdgeRegion) {
  let m = caches.get(region);
  if (!m) {
    m = new Map();
    caches.set(region, m);
  }
  return m;
}

export function cacheSet<T>(region: EdgeRegion, key: string, value: T, ttlMs = 30_000) {
  bucket(region).set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheGet<T>(region: EdgeRegion, key: string): T | null {
  const e = bucket(region).get(key);
  if (!e) return null;
  if (e.expiresAt < Date.now()) {
    bucket(region).delete(key);
    return null;
  }
  return e.value as T;
}

export function cacheInvalidate(region: EdgeRegion, key: string) {
  bucket(region).delete(key);
}
