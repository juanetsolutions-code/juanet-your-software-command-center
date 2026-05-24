export type EdgeRegion = "auto" | "us-east" | "us-west" | "eu-west" | "eu-central" | "ap-southeast" | "ap-northeast" | "sa-east";

export interface EdgeRouteRequest {
  tenantId: string;
  preferredRegion?: EdgeRegion;
  capability?: string;
}

export function pickRegion(req: EdgeRouteRequest): EdgeRegion {
  if (req.preferredRegion && req.preferredRegion !== "auto") return req.preferredRegion;
  // Future: derive from geo-context / latency-strategy
  return "us-east";
}
