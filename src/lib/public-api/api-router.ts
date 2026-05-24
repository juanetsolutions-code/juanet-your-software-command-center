/**
 * Public API Router Foundation
 * Versioned, tenant-aware routing for external API.
 */

export interface ApiRoute {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  version: string;
  handler: (req: any, res: any) => void;
}

const routes: ApiRoute[] = [];

export function registerApiRoute(route: ApiRoute) {
  routes.push(route);
}

export function getApiRoutes(version?: string) {
  return version ? routes.filter((r) => r.version === version) : routes;
}
