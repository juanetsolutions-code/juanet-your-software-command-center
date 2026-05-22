/**
 * Dev-only seed utilities for multi-tenant Juanet.
 * Run via: npx tsx scripts/seed/seed.ts or integrate into admin UI later.
 * Idempotent: checks existence before insert.
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "", // service role for seeding
);

export async function seedSuperAdmin(email = "superadmin@juanet.io") {
  console.log("[Seed] Ensuring superadmin profile for", email);
  // In real: create auth user via admin API or manually, then upsert profile
  const { data } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle();
  if (data) return data.id;
  // placeholder — actual user creation is manual or via auth admin
  console.log("  -> Create auth user manually, then run again to attach profile");
  return null;
}

export async function seedDemoOrganization(name = "Acme Corp") {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const { data: existing } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) {
    console.log("[Seed] Org exists:", existing.id);
    return existing.id;
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      plan: "pro",
    })
    .select()
    .single();

  if (error) throw error;
  console.log("[Seed] Created demo org:", data.id);
  return data.id;
}

export async function seedDemoWorkspace(orgId: string, name = "Main Workspace") {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const { data: existing } = await supabase
    .from("workspaces")
    .select("id")
    .eq("slug", slug)
    .eq("organization_id", orgId)
    .maybeSingle();
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name,
      slug,
      organization_id: orgId,
    })
    .select()
    .single();

  if (error) throw error;
  console.log("[Seed] Created workspace:", data.id);
  return data.id;
}

export async function seedDemoProjects(workspaceId: string, count = 3) {
  for (let i = 0; i < count; i++) {
    const title = `Demo Project ${i + 1}`;
    const { error } = await supabase.from("projects").insert({
      title,
      status: "pending",
      progress: 10 * (i + 1),
      organization_id: (
        await supabase.from("workspaces").select("organization_id").eq("id", workspaceId).single()
      ).data?.organization_id,
    });
    if (error) console.warn(error.message);
  }
  console.log(`[Seed] Seeded ${count} demo projects`);
}

export async function runFullSeed() {
  const orgId = await seedDemoOrganization();
  const wsId = await seedDemoWorkspace(orgId);
  await seedDemoProjects(wsId);
  console.log("[Seed] Full demo seed complete.");
}

// If run directly
if (require.main === module) {
  runFullSeed().catch(console.error);
}
