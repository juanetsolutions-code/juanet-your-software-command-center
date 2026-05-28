import { createFileRoute } from "@tanstack/react-router";
import { Settings, User, Bell, Shield, Palette, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
  head: () => ({
    meta: [
      { title: "Admin Settings | Admin Console" },
      { name: "description", content: "Configure the platform and team preferences." },
    ],
  }),
});

const settingsGroups = [
  { label: "Team", to: "/admin/settings/team", icon: User },
  { label: "Branding", to: "/admin/settings/branding", icon: Palette },
  { label: "Notifications", to: "/admin/settings/notifications", icon: Bell },
  { label: "Security", to: "/admin/settings/security", icon: Shield },
  { label: "API Access", to: "/admin/settings/api", icon: Globe },
];

function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure the platform and team preferences.
        </p>
      </header>

      <div className="glass rounded-2xl p-5">
        <ul className="space-y-2">
          {settingsGroups.map((group) => (
            <li key={group.to}>
              <Link
                to={group.to}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <group.icon className="h-5 w-5 text-brand-cyan" />
                <span>{group.label}</span>
                <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}