/**
 * Connector SDK - Validation Layer
 * Provides configuration and runtime validation for connectors.
 */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "object" | "array";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export class ConnectorValidator {
  private rules: ValidationRule[] = [];

  addRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  validate(config: Record<string, any>): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    };

    this.rules.forEach((rule) => {
      const value = config[rule.field];

      if (rule.required && (value === undefined || value === null || value === "")) {
        result.errors.push(`Field '${rule.field}' is required`);
        result.valid = false;
      }

      if (value !== undefined && rule.type) {
        const actualType = Array.isArray(value) ? "array" : typeof value;
        if (actualType !== rule.type) {
          result.errors.push(`Field '${rule.field}' must be of type ${rule.type}`);
          result.valid = false;
        }
      }

      if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        result.errors.push(`Field '${rule.field}' must be at least ${rule.minLength} characters`);
        result.valid = false;
      }

      if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        result.errors.push(`Field '${rule.field}' must be at most ${rule.maxLength} characters`);
        result.valid = false;
      }

      if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        result.errors.push(`Field '${rule.field}' does not match required pattern`);
        result.valid = false;
      }

      if (rule.customValidator && !rule.customValidator(value)) {
        result.errors.push(`Field '${rule.field}' failed custom validation`);
        result.valid = false;
      }
    });

    return result;
  }
}
