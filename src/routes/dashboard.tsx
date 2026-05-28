import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  Inbox,
  MessageSquare,
  CreditCard,
  Download,
  KeyRound,
  Settings,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/app/AppShell";
import { requireRole } from "@/lib/auth";

const items: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/dashboard/projects", icon: FolderKanban },
  { label: "Requests", to: "/dashboard/requests", icon: Inbox },
  { label: "Messages", to: "/dashboard/messages", icon: MessageSquare },
  { label: "Payments", to: "/dashboard/payments", icon: CreditCard },
  { label: "Downloads", to: "/dashboard/downloads", icon: Download },
  { label: "Licenses", to: "/dashboard/licenses", icon: KeyRound },
  { label: "Settings", to: "/dashboard/settings", icon: Settings },
];

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => requireRole("client", location.href),
  head: () => ({
    meta: [
      { title: "Dashboard | Juanet" },
      { name: "description", content: "Your project workspace and collaboration hub." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AppShell brand="Client Portal" items={items}>
      <Outlet />
    </AppShell>
  );
}
