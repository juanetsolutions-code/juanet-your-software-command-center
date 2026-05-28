/**
 * Module Completeness Audit
 */

import type { ModuleCompleteness } from "./frontend-audit";

export interface ModuleChecklist {
  module: string;
  routes: string[];
  components: string[];
  hooks: string[];
  services: string[];
  completeness: number;
}

export const MODULE_CHECKLISTS: ModuleChecklist[] = [
  {
    module: "dashboard",
    routes: ["index", "projects", "requests", "messages", "payments"],
    components: [
      "StatCard",
      "StatusBadge",
      "AppShell",
      "ProjectCard",
      "ProjectDetailPanel",
      "ProjectPipelineRow",
      "RequestForm",
      "ConversationList",
      "MessageThread",
      "InvoiceTable",
      "PaymentMethodCard",
      "ActivityFeed",
    ],
    hooks: ["usePayments", "useInvoices", "useMessages", "useRequests", "useProjects"],
    services: ["dashboard-api"],
    completeness: 85,
  },
  {
    module: "admin",
    routes: ["index", "users", "services", "health", "integrations"],
    components: [],
    hooks: [],
    services: [],
    completeness: 35,
  },
  {
    module: "auth",
    routes: ["login", "signup", "forgot"],
    components: [],
    hooks: [],
    services: ["auth-api", "auth-store", "auth-guards", "auth-roles"],
    completeness: 70,
  },
  {
    module: "marketing",
    routes: ["index", "services", "projects", "portfolio", "shop", "about", "contact"],
    components: [
      "Hero",
      "ServicesGrid",
      "OngoingProjects",
      "PortfolioGrid",
      "MarketplacePreview",
      "CTA",
      "Navbar",
      "Section",
      "Footer",
    ],
    hooks: [],
    services: [],
    completeness: 80,
  },
];
