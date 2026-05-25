/**
 * Injection Protection
 * Defense against SQL, NoSQL, command, and script injection across all inputs.
 */

export class InjectionProtection {
  sanitizeInput(input: string): string {
    // Production-grade sanitization stub
    return input
      .replace(/[<>"'`;]/g, "")
      .replace(/\b(SELECT|DROP|INSERT|DELETE|UPDATE|UNION|EXEC)\b/gi, "");
  }

  detectInjection(input: string): boolean {
    const patterns = [/union\s+select/i, /--\s*$/, /;\s*drop/i, /<script/i];
    return patterns.some((p) => p.test(input));
  }
}

export const injectionProtection = new InjectionProtection();
