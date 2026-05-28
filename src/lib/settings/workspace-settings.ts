type SettingsScope = "user" | "workspace" | "tenant";

export type SettingValue = string | number | boolean | Record<string, unknown>;

export interface SettingDefinition {
  key: string;
  label: string;
  description?: string;
  type: "text" | "number" | "boolean" | "select" | "json";
  scope: SettingsScope;
  defaultValue: SettingValue;
  options?: { value: string; label: string }[];
  permissions?: string[];
}

export interface WorkspaceSettings {
  general: {
    name: string;
    timezone: string;
    locale: string;
  };
  notifications: {
    email: boolean;
    slack: boolean;
    frequency: "realtime" | "daily" | "weekly";
  };
  appearance: {
    theme: "dark" | "light";
    density: "compact" | "comfortable";
  };
}

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  general: { name: "Default Workspace", timezone: "UTC", locale: "en-US" },
  notifications: { email: true, slack: false, frequency: "realtime" },
  appearance: { theme: "dark", density: "comfortable" },
};
