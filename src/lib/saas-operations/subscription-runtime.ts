/**
 * Subscription Runtime
 * Manages real subscription lifecycle operations.
 */

export interface Subscription {
  tenantId: string;
  plan: string;
  status: "active" | "past_due" | "canceled";
  currentPeriodEnd: string;
}

export class SubscriptionRuntime {
  private subs = new Map<string, Subscription>();

  update(tenantId: string, plan: string): Subscription {
    const sub: Subscription = {
      tenantId,
      plan,
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    this.subs.set(tenantId, sub);
    return sub;
  }
}

export const subscriptionRuntime = new SubscriptionRuntime();
