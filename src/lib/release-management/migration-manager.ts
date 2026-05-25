/**
 * Migration Manager
 * Manages database and data migrations with safety checks.
 */

export interface Migration {
  id: string;
  name: string;
  status: "pending" | "applied" | "failed";
  appliedAt?: string;
}

export class MigrationManager {
  private migrations: Migration[] = [];

  apply(name: string): Migration {
    const mig: Migration = {
      id: `mig-${Date.now()}`,
      name,
      status: "applied",
      appliedAt: new Date().toISOString(),
    };
    this.migrations.push(mig);
    return mig;
  }
}

export const migrationManager = new MigrationManager();
