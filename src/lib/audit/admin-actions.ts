/**
 * Admin Actions Audit
 * Special audit category for high-privilege administrative operations.
 */

export interface AdminActionEntry {
  id: string;
  adminId: string;
  action: string;
  targetTenant?: string;
  details: Record<string, any>;
  timestamp: string;
}

export class AdminActions {
  private log: AdminActionEntry[] = [];

  record(entry: Omit<AdminActionEntry, "id" | "timestamp">): AdminActionEntry {
    const full = { ...entry, id: `admin-${Date.now()}`, timestamp: new Date().toISOString() };
    this.log.push(full);
    return full;
  }

  getAll(): AdminActionEntry[] {
    return [...this.log];
  }
}

export const adminActions = new AdminActions();
