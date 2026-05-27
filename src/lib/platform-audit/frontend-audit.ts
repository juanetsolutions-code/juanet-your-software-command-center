/**
 * Frontend Audit - Routes, Layouts, Navigation Analysis
 */

export interface RouteAudit {
  path: string;
  exists: boolean;
  hasLayout: boolean;
  hasHead: boolean;
  hasLoadingState: boolean;
  hasErrorState: boolean;
  hasEmptyState: boolean;
  workflowComplete: boolean;
  issues: string[];
}

export interface ModuleCompleteness {
  module: string;
  files: string[];
  hasList: boolean;
  hasDetail: boolean;
  hasActions: boolean;
  hasEmptyState: boolean;
  completeness: number;
  missingFeatures: string[];
}

export const ROUTE_AUDIT: Record<string, RouteAudit> = {
  "/": {
    path: "/",
    exists: true,
    hasLayout: true,
    hasHead: true,
    hasLoadingState: false,
    hasErrorState: true,
    hasEmptyState: false,
    workflowComplete: true,
    issues: [],
  },
  "/dashboard": {
    path: "/dashboard",
    exists: true,
    hasLayout: true,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: ["No head metadata"],
  },
  "/dashboard/": {
    path: "/dashboard/",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: [],
  },
  "/dashboard/projects": {
    path: "/dashboard/projects",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: true,
    workflowComplete: true,
    issues: ["Missing head metadata", "No loading state"],
  },
  "/dashboard/requests": {
    path: "/dashboard/requests",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: ["Missing head metadata", "No loading state"],
  },
  "/dashboard/messages": {
    path: "/dashboard/messages",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: ["Missing head metadata", "No loading state"],
  },
  "/dashboard/payments": {
    path: "/dashboard/payments",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: ["Missing head metadata", "No loading state"],
  },
  "/admin": {
    path: "/admin",
    exists: true,
    hasLayout: true,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: false,
    issues: ["Missing head metadata", "Only overview page exists - missing operational pages"],
  },
  "/admin/": {
    path: "/admin/",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: [],
  },
  "/auth/login": {
    path: "/auth/login",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: true,
    hasEmptyState: false,
    workflowComplete: true,
    issues: ["Missing head metadata"],
  },
  "/auth/signup": {
    path: "/auth/signup",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: [],
  },
  "/auth/forgot": {
    path: "/auth/forgot",
    exists: true,
    hasLayout: false,
    hasHead: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasEmptyState: false,
    workflowComplete: true,
    issues: [],
  },
};

export const MODULE_COMPLETENESS: ModuleCompleteness[] = [
  {
    module: "projects",
    files: ["ProjectCard", "ProjectDetailPanel", "ProjectPipelineRow"],
    hasList: true,
    hasDetail: true,
    hasActions: false,
    hasEmptyState: true,
    completeness: 60,
    missingFeatures: ["Edit project", "Delete project", "Status transitions", "File attachments"],
  },
  {
    module: "requests",
    files: ["RequestForm"],
    hasList: true,
    hasDetail: false,
    hasActions: false,
    hasEmptyState: true,
    completeness: 40,
    missingFeatures: ["Request detail view", "Status workflow", "File upload", "Comments"],
  },
  {
    module: "messages",
    files: ["ConversationList", "MessageThread"],
    hasList: true,
    hasDetail: true,
    hasActions: false,
    hasEmptyState: false,
    completeness: 50,
    missingFeatures: [
      "Empty state",
      "Attachment support",
      "Message reactions",
      "Presence indicators",
    ],
  },
  {
    module: "payments",
    files: ["InvoiceTable", "PaymentMethodCard"],
    hasList: true,
    hasDetail: false,
    hasActions: true,
    hasEmptyState: false,
    completeness: 55,
    missingFeatures: [
      "Invoice detail view",
      "Payment history",
      "Receipt download",
      "Auto-pay toggle",
    ],
  },
  {
    module: "admin",
    files: ["AdminOverview"],
    hasList: false,
    hasDetail: false,
    hasActions: false,
    hasEmptyState: false,
    completeness: 25,
    missingFeatures: [
      "Tenant overview",
      "Subscription management",
      "Audit logs",
      "Platform health",
      "Integrations status",
      "AI operations",
    ],
  },
];

export const MISSING_PAGES = [
  "/dashboard/downloads",
  "/dashboard/licenses",
  "/admin/users",
  "/admin/services",
  "/admin/orders",
  "/admin/cms",
  "/admin/settings",
];
