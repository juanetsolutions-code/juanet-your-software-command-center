/**
 * Safe development-only logger.
 * Prevents console spam in production.
 */

const isDev = import.meta.env.DEV || import.meta.env.MODE === "development";

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.info("[INFO]", ...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn("[WARN]", ...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error("[ERROR]", ...args);
  },
};
