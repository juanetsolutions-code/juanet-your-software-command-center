import type { SettingDefinition } from "./workspace-settings";

export const SETTINGS_REGISTRY: SettingDefinition[] = [
  {
    key: "workspace.name",
    label: "Workspace Name",
    description: "The name displayed in your workspace.",
    type: "text",
    scope: "workspace",
    defaultValue: "My Workspace",
  },
  {
    key: "workspace.timezone",
    label: "Timezone",
    description: "Default timezone for scheduling.",
    type: "select",
    scope: "workspace",
    defaultValue: "UTC",
    options: [
      { value: "UTC", label: "UTC" },
      { value: "America/New_York", label: "Eastern Time" },
      { value: "Europe/London", label: "London" },
      { value: "Asia/Tokyo", label: "Tokyo" },
      { value: "Africa/Nairobi", label: "Nairobi" },
    ],
  },
  {
    key: "notifications.email",
    label: "Email Notifications",
    description: "Receive email updates.",
    type: "boolean",
    scope: "user",
    defaultValue: true,
  },
  {
    key: "notifications.slack",
    label: "Slack Integration",
    description: "Send notifications to Slack.",
    type: "boolean",
    scope: "workspace",
    defaultValue: false,
  },
  {
    key: "appearance.theme",
    label: "Theme",
    description: "Interface appearance.",
    type: "select",
    scope: "user",
    defaultValue: "dark",
    options: [
      { value: "dark", label: "Dark" },
      { value: "light", label: "Light" },
    ],
  },
  {
    key: "api.key",
    label: "API Key",
    description: "Access key for programmatic access.",
    type: "text",
    scope: "tenant",
    defaultValue: "",
    permissions: ["admin"],
  },
];

export function getSettingDefinition(key: string): SettingDefinition | undefined {
  return SETTINGS_REGISTRY.find((s) => s.key === key);
}

export function getSettingsByScope(scope: "user" | "workspace" | "tenant"): SettingDefinition[] {
  return SETTINGS_REGISTRY.filter((s) => s.scope === scope);
}
