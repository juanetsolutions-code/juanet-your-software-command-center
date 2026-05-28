import { createFileRoute } from "@tanstack/react-router";
import { Settings, User, Bell, Shield, Palette, Globe, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

const settingsGroups = [
  { label: "Account", to: "/dashboard/settings/account", icon: User },
  { label: "Notifications", to: "/dashboard/settings/notifications", icon: Bell },
  { label: "Security", to: "/dashboard/settings/security", icon: Shield },
  { label: "Appearance", to: "/dashboard/settings/appearance", icon: Palette },
  { label: "API Access", to: "/dashboard/settings/api", icon: Globe },
];

function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and workspace preferences.
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
