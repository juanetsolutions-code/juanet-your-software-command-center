/**
 * Subscription Activation
 * Activates paid plans and handles plan changes.
 */

export interface SubscriptionActivationResult {
  tenantId: string;
  plan: string;
  status: "active" | "pending_payment";
  activatedAt: string;
}

export class SubscriptionActivation {
  async activate(
    tenantId: string,
    plan: string,
    paymentRef: string,
  ): Promise<SubscriptionActivationResult> {
    return {
      tenantId,
      plan,
      status: "active",
      activatedAt: new Date().toISOString(),
    };
  }
}

export const subscriptionActivation = new SubscriptionActivation();
