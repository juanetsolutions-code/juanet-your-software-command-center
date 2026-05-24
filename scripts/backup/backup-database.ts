/**
 * Database Backup Utility (Development / Staging Safe)
 *
 * Generates structured backup metadata and JSON dump instructions.
 * Does NOT perform destructive or live production backups.
 *
 * Usage: npx tsx scripts/backup/backup-database.ts
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const BACKUP_DIR = join(process.cwd(), "backups");
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");

interface BackupMetadata {
  timestamp: string;
  environment: string;
  type: "full" | "tenant";
  tables: string[];
  notes: string;
  supabaseProject?: string;
}

function ensureBackupDir() {
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

export function createDatabaseBackup(environment = "local"): string {
  ensureBackupDir();

  const metadata: BackupMetadata = {
    timestamp: TIMESTAMP,
    environment,
    type: "full",
    tables: [
      "profiles",
      "organizations",
      "organization_members",
      "workspaces",
      "projects",
      "requests",
      "messages",
      "invoices",
      "payments",
      "audit_logs",
    ],
    notes: "Generated via dev backup script. Use Supabase CLI or pg_dump for actual data export.",
    supabaseProject: process.env.SUPABASE_PROJECT_REF || "unknown",
  };

  const filename = `backup-${environment}-${TIMESTAMP}.json`;
  const filepath = join(BACKUP_DIR, filename);

  writeFileSync(filepath, JSON.stringify(metadata, null, 2));

  console.log(`✅ Backup metadata created: ${filepath}`);
  console.log("To perform actual backup, run: supabase db dump --file backup.sql");

  return filepath;
}

if (require.main === module) {
  createDatabaseBackup(process.env.NODE_ENV || "local");
}
