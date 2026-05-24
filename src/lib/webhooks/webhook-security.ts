/**
 * Webhook Security - Signature verification and validation.
 */

import { createHmac } from "crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  const expected = hmac.digest("hex");
  return expected === signature;
}
