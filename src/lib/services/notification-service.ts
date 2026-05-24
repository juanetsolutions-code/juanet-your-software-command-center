/**
 * Notification Service (internal wiring only - no UI yet)
 * Hooks into auth and mutation events via the facade.
 */

import { logger } from "@/lib/utils/logger";
import { audit } from "@/lib/audit/logger";

export const notificationService = {
  init() {
    logger.info("[Notifications] Service initialized (silent mode)");

    // Future wiring points (non-visual for now):
    // - Listen to auth events
    // - Listen to new messages / invoices via facade or events
  },

  onAuthEvent(type: "login" | "logout") {
    audit.log(type === "login" ? "auth.login" : "auth.logout");
    logger.info(`[Notifications] Auth event: ${type} (no toast yet)`);
  },

  onNewMessage(conversationId: string) {
    logger.info(`[Notifications] New message in ${conversationId} (silent)`);
  },

  onInvoiceCreated(invoiceId: string) {
    logger.info(`[Notifications] Invoice created: ${invoiceId} (silent)`);
  },

  // Automation integration (backend only)
  onAutomationEvent(eventType: string, payload: any) {
    logger.info(`[Notifications] Automation event ${eventType} triggered (silent)`, payload);
  },

  // AI-generated notifications (backend only, no UI)
  onAIGeneratedAlert(tenantId: string, message: string, type = 'ai_insight') {
    logger.info(`[Notifications] AI alert for ${tenantId}: ${message} (silent)`);
  },
};

// Auto-init on import
notificationService.init();
