/**
 * Theme Configuration
 */

export interface ThemeConfig {
  tenantId: string;
  theme: "light" | "dark" | "custom";
  customCss?: string;
}

const themes = new Map<string, ThemeConfig>();

export function setThemeConfig(tenantId: string, config: ThemeConfig) {
  themes.set(tenantId, config);
}

export function getThemeConfig(tenantId: string): ThemeConfig | undefined {
  return themes.get(tenantId);
}
