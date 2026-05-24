import { findWorkers, type Worker } from "./worker-registry";

export interface RouteRequest {
  capabilities: string[];
  region?: string;
}

export function routeJob(req: RouteRequest): Worker | null {
  const candidates = findWorkers(req.capabilities);
  if (candidates.length === 0) return null;
  const regional = req.region ? candidates.filter((w) => w.region === req.region) : candidates;
  const pool = regional.length > 0 ? regional : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}
