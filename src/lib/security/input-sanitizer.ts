/**
 * Input Sanitizer
 * Prevents XSS, injection, and unsafe data before it reaches repositories or DB.
 */

export function sanitizeString(input: unknown, maxLength = 500): string {
  if (typeof input !== "string") return "";
  let clean = input.trim();

  // Basic XSS prevention
  clean = clean
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  // Length limit
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength);
  }

  return clean;
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== "string") return "";
  const clean = email.toLowerCase().trim();
  // Very basic validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return "";
  return clean;
}

export function sanitizeId(id: unknown): string | null {
  if (typeof id !== "string") return null;
  const clean = id.trim();
  // UUID or safe slug pattern
  if (/^[a-zA-Z0-9_-]{1,100}$/.test(clean)) {
    return clean;
  }
  return null;
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowedKeys: string[],
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allowedKeys) {
    if (key in obj) {
      const val = obj[key];
      if (typeof val === "string") {
        (result as any)[key] = sanitizeString(val);
      } else {
        (result as any)[key] = val;
      }
    }
  }
  return result;
}
