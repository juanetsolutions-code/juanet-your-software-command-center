/**
 * Analytics (silent tracking layer)
 * Tracks events via facade without any UI impact.
 */

import { logger } from "@/lib/utils/logger";

export const analytics = {
  init() {
    logger.info("[Analytics] Silent analytics initialized");
  },

  track(event: string, properties?: Record<string, unknown>) {
    logger.info(`[Analytics] ${event}`, properties);
    // Future: send to PostHog / Mixpanel / Supabase analytics table
  },

  pageView(path: string) {
    this.track("page_view", { path });
  },

  authEvent(type: "login" | "signup" | "logout") {
    this.track(`auth_${type}`);
  },

  apiCall(name: string, success: boolean) {
    this.track("api_call", { name, success });
  },
};

analytics.init();
