import type { EventHandler } from "../event-bus/event-bus";

export type TenantSubscription = {
  id: string;
  tenantId: string;
  handlerId: string;
  isActive: boolean;
  createdAt: string;
};

class SubscriptionManager {
  private subscriptions: Map<string, TenantSubscription> = new Map();

  subscribe(tenantId: string, handler: EventHandler): TenantSubscription {
    const subscription: TenantSubscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      tenantId,
      handlerId: handler.id,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.isActive = false;
      this.subscriptions.set(subscriptionId, subscription);
      return true;
    }
    return false;
  }

  get(tenantId: string, handlerId?: string): TenantSubscription[] {
    return Array.from(this.subscriptions.values()).filter((s) => {
      if (!s.isActive) return false;
      if (s.tenantId !== tenantId) return false;
      if (handlerId && s.handlerId !== handlerId) return false;
      return true;
    });
  }

  getAll(): TenantSubscription[] {
    return Array.from(this.subscriptions.values());
  }

  clear(tenantId?: string): void {
    if (tenantId) {
      for (const [id, sub] of this.subscriptions) {
        if (sub.tenantId === tenantId) {
          this.subscriptions.delete(id);
        }
      }
    } else {
      this.subscriptions.clear();
    }
  }
}

export const subscriptionManager = new SubscriptionManager();

export function subscribeTenant(tenantId: string, handler: EventHandler): TenantSubscription {
  return subscriptionManager.subscribe(tenantId, handler);
}

export function unsubscribe(subscriptionId: string): boolean {
  return subscriptionManager.unsubscribe(subscriptionId);
}

export function getTenantSubscriptions(tenantId: string, handlerId?: string): TenantSubscription[] {
  return subscriptionManager.get(tenantId, handlerId);
}