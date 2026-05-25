/**
 * Config Validation
 * Validates configuration changes before they are applied.
 */

export class ConfigValidation {
  validate(key: string, value: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (key === "max_connections" && (typeof value !== "number" || value < 10)) {
      errors.push("max_connections must be at least 10");
    }
    return { valid: errors.length === 0, errors };
  }
}

export const configValidation = new ConfigValidation();
