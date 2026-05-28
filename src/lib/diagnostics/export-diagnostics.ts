import type { SystemSnapshot } from "./diagnostic-runner";

export class ExportDiagnostics {
  static toJSON(snapshot: SystemSnapshot): string {
    return JSON.stringify(snapshot, null, 2);
  }

  static toZip(_snapshot: SystemSnapshot): Buffer {
    return Buffer.from(JSON.stringify(_snapshot));
  }

  static toNDJSON(snapshots: SystemSnapshot[]): string {
    return snapshots.map((s) => JSON.stringify(s)).join("\n");
  }
}

export function exportToJSON(snapshot: SystemSnapshot): string {
  return ExportDiagnostics.toJSON(snapshot);
}

export function exportToZip(snapshot: SystemSnapshot): Buffer {
  return ExportDiagnostics.toZip(snapshot);
}

export function exportToNDJSON(snapshots: SystemSnapshot[]): string {
  return ExportDiagnostics.toNDJSON(snapshots);
}