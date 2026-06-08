/**
 * Route Health Check System
 *
 * Audits navigation links against defined routes and identifies mismatches.
 * Used to validate that every navigation item has a corresponding route page.
 */

import type { FileRoutesById } from "../routeTree.gen";

type RouteInfo = {
  path: string;
  fullPath: string;
  exists: boolean;
  file?: string;
};

type NavItemCheck = {
  label: string;
  to: string;
  exists: boolean;
  route?: string;
};

export function getRoutesFromTree(): RouteInfo[] {
  const routePaths = [
    "/",
    "/admin",
    "/auth",
    "/dashboard",
    "/about",
    "/contact",
    "/portfolio",
    "/projects",
    "/services",
    "/shop",
    "/admin/ai-operations",
    "/admin/audit-center",
    "/admin/cms",
    "/admin/health",
    "/admin/integrations",
    "/admin/licenses",
    "/admin/orders",
    "/admin/payments",
    "/admin/projects",
    "/admin/services",
    "/admin/settings",
    "/admin/shop",
    "/admin/support-queue",
    "/admin/usage-monitoring",
    "/admin/users",
    "/auth/forgot",
    "/auth/login",
    "/auth/signup",
    "/dashboard/activity",
    "/dashboard/api-access",
    "/dashboard/downloads",
    "/dashboard/licenses",
    "/dashboard/messages",
    "/dashboard/notifications",
    "/dashboard/payments",
    "/dashboard/projects",
    "/dashboard/requests",
    "/dashboard/settings",
    "/admin/crm/contacts",
    "/admin/crm/dashboard",
    "/admin/crm/deals",
    "/admin/crm/leads",
    "/admin/crm/pipelines",
    "/admin/crm/tasks",
    "/admin/crm/",
    "/dashboard/crm/",
  ];

  return routePaths.map((path) => ({
    path,
    fullPath: path,
    exists: true,
  }));
}

export function checkNavigationRoutes(
  navItems: Array<{ label: string; to: string }>,
): NavItemCheck[] {
  const validRoutes = getRoutesFromTree();

  return navItems.map((item) => {
    const route = validRoutes.find((r) => r.path === item.to);
    return {
      label: item.label,
      to: item.to,
      exists: !!route,
      route: route?.path,
    };
  });
}

export function getBrokenLinks(navItems: Array<{ label: string; to: string }>): NavItemCheck[] {
  const checks = checkNavigationRoutes(navItems);
  return checks.filter((check) => !check.exists);
}

export class RouteHealthCheck {
  private static instance: RouteHealthCheck;

  static getInstance(): RouteHealthCheck {
    if (!RouteHealthCheck.instance) {
      RouteHealthCheck.instance = new RouteHealthCheck();
    }
    return RouteHealthCheck.instance;
  }

  validateRoute(routePath: string): boolean {
    const validRoutes = getRoutesFromTree();
    return validRoutes.some((r) => r.path === routePath);
  }

  getMissingRoutes(navItems: Array<{ label: string; to: string }>): string[] {
    const checks = checkNavigationRoutes(navItems);
    return checks.filter((c) => !c.exists).map((c) => c.to);
  }
}
