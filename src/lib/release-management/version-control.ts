/**
 * Version Control
 * Tracks versions of backend services and libraries.
 */

export interface VersionRecord {
  service: string;
  version: string;
  deployedAt: string;
}

export class VersionControl {
  private versions: VersionRecord[] = [];

  record(service: string, version: string): VersionRecord {
    const rec: VersionRecord = { service, version, deployedAt: new Date().toISOString() };
    this.versions.push(rec);
    return rec;
  }
}

export const versionControl = new VersionControl();
