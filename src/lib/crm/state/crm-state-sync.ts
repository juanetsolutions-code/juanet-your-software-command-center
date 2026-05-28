import type { Lead } from "../core/crm-entities";
import type { Deal } from "../core/crm-entities";

export type CrmStateSnapshot = {
  leads: Record<string, Lead>;
  deals: Record<string, Deal>;
  lastSync: string;
  syncVersion: number;
};

export class CrmStateSync {
  private snapshots: Map<string, CrmStateSnapshot> = new Map();

  async syncTenant(tenantId: string): Promise<CrmStateSnapshot> {
    const leads = await import("../services/lead-service").then(m => m.leadService.list(tenantId));
    const deals = await import("../services/deal-service").then(m => m.dealService.list(tenantId));

    const snapshot: CrmStateSnapshot = {
      leads: {},
      deals: {},
      lastSync: new Date().toISOString(),
      syncVersion: 1,
    };

    for (const lead of leads) {
      snapshot.leads[lead.id] = lead;
    }

    for (const deal of deals) {
      snapshot.deals[deal.id] = deal;
    }

    const existing = this.snapshots.get(tenantId);
    snapshot.syncVersion = (existing?.syncVersion ?? 0) + 1;

    this.snapshots.set(tenantId, snapshot);
    return snapshot;
  }

  getSnapshot(tenantId: string): CrmStateSnapshot | undefined {
    return this.snapshots.get(tenantId);
  }

  detectDrift(tenantId: string, current: CrmStateSnapshot): boolean {
    const stored = this.snapshots.get(tenantId);
    if (!stored) return false;

    for (const leadId in current.leads) {
      if (current.leads[leadId].updatedAt !== stored.leads[leadId]?.updatedAt) {
        return true;
      }
    }

    return false;
  }
}