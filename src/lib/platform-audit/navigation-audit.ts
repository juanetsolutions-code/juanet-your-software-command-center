/**
 * Navigation Audit - Consistency and Completeness
 */

export interface NavItem {
  label: string;
  to: string;
  icon?: string;
}

export interface NavAudit {
  route: string;
  navItems: NavItem[];
  hasMobileNav: boolean;
  hasBreadcrumbs: boolean;
  issues: string[];
}

export const NAVIGATION_CONFIG = {
  mainNav: [
    { label: "Home", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Projects", to: "/projects" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  dashboardNav: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Projects", to: "/dashboard/projects" },
    { label: "Requests", to: "/dashboard/requests" },
    { label: "Messages", to: "/dashboard/messages" },
    { label: "Payments", to: "/dashboard/payments" },
    { label: "Downloads", to: "/dashboard/downloads" },
    { label: "Licenses", to: "/dashboard/licenses" },
    { label: "Settings", to: "/dashboard/settings" },
  ],
  adminNav: [
    { label: "Overview", to: "/admin" },
    { label: "Users", to: "/admin/users" },
    { label: "Services", to: "/admin/services" },
    { label: "Projects", to: "/admin/projects" },
    { label: "Orders", to: "/admin/orders" },
    { label: "Shop", to: "/admin/shop" },
    { label: "Licenses", to: "/admin/licenses" },
    { label: "Payments", to: "/admin/payments" },
    { label: "CMS", to: "/admin/cms" },
    { label: "Settings", to: "/admin/settings" },
  ],
};

export const NAVIGATION_AUDITS: NavAudit[] = [
  {
    route: "/dashboard",
    navItems: NAVIGATION_CONFIG.dashboardNav,
    hasMobileNav: true,
    hasBreadcrumbs: false,
    issues: ["No breadcrumbs", "Downloads/licenses/settings missing routes"],
  },
  {
    route: "/admin",
    navItems: NAVIGATION_CONFIG.adminNav,
    hasMobileNav: true,
    hasBreadcrumbs: false,
    issues: ["No breadcrumbs", "9/10 routes missing"],
  },
];
