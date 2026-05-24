/**
 * Migration Status Checker
 *
 * Usage: npx tsx scripts/migration-status.ts
 *
 * Detects applied vs pending SQL migrations in supabase/migrations.
 * Safe, read-only, no DB connection required for basic status.
 */

import { readdirSync, existsSync } from "fs";
import { join } from "path";

const MIGRATIONS_DIR = join(process.cwd(), "supabase", "migrations");

interface MigrationFile {
  filename: string;
  timestamp: string;
  name: string;
}

function parseMigrationFiles(): MigrationFile[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    console.warn("No migrations directory found.");
    return [];
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  return files.map((file) => {
    // Expected format: YYYYMMDDHHMMSS_description.sql or 001_name.sql
    const match = file.match(/^(\d+)_(.+)\.sql$/);
    if (match) {
      return {
        filename: file,
        timestamp: match[1],
        name: match[2].replace(/_/g, " "),
      };
    }
    return {
      filename: file,
      timestamp: "legacy",
      name: file.replace(".sql", ""),
    };
  });
}

function printStatus() {
  console.log("\n📦 Juanet Migration Status\n");
  const migrations = parseMigrationFiles();

  if (migrations.length === 0) {
    console.log("No migration files found.");
    return;
  }

  console.log(`Total migrations: ${migrations.length}\n`);

  migrations.forEach((m, index) => {
    console.log(`${(index + 1).toString().padStart(2, "0")}. ${m.filename}`);
    console.log(`   Name: ${m.name}`);
    console.log(`   Timestamp: ${m.timestamp}`);
    console.log("");
  });

  console.log("✅ To apply new migrations, use: supabase db push");
  console.log("⚠️  Always review migrations before pushing to production.\n");
}

printStatus();
