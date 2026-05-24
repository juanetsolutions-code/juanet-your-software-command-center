import type { EdgeRegion } from "./edge-router";

const fallbackOrder: Record<EdgeRegion, EdgeRegion[]> = {
  auto: ["us-east", "eu-west"],
  "us-east": ["us-west", "eu-west"],
  "us-west": ["us-east", "ap-southeast"],
  "eu-west": ["eu-central", "us-east"],
  "eu-central": ["eu-west", "us-east"],
  "ap-southeast": ["ap-northeast", "us-west"],
  "ap-northeast": ["ap-southeast", "us-west"],
  "sa-east": ["us-east", "eu-west"],
};

export function getFallbackChain(region: EdgeRegion): EdgeRegion[] {
  return [region, ...(fallbackOrder[region] ?? [])];
}
