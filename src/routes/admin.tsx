import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FolderKanban,
  ShoppingBag,
  Store,
  KeyRound,
  CreditCard,
  FileText,
  Settings,
  Activity,
  Plug,
  Brain,
  FileSearch,
  LifeBuoy,
  BarChart3,
  UserPlus,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/AppShell";
import { requireRole } from "@/lib/auth";

const items: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Services", to: "/admin/services", icon: Briefcase },
  { label: "CRM", to: "/admin/crm", icon: UserPlus },
  { label: "Health", to: "/admin/health", icon: Activity },
  { label: "Audit Center", to: "/admin/audit-center", icon: FileSearch },
  { label: "Support Queue", to: "/admin/support-queue", icon: LifeBuoy },
  { label: "Usage Monitoring", to: "/admin/usage-monitoring", icon: BarChart3 },
  { label: "Integrations", to: "/admin/integrations", icon: Plug },
  { label: "AI Ops", to: "/admin/ai-operations", icon: Brain },
  { label: "Projects", to: "/admin/projects", icon: FolderKanban },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Shop", to: "/admin/shop", icon: Store },
  { label: "Licenses", to: "/admin/licenses", icon: KeyRound },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "CMS", to: "/admin/cms", icon: FileText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => requireRole("admin", location.href),
  head: () => ({
    meta: [
      { title: "Admin Console | Juanet" },
      { name: "description", content: "Platform administration and operational controls." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell brand="Admin Console" items={items}>
      <Outlet />
    </AppShell>
  );
}
