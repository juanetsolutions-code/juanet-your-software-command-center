/**
 * Auto-bootstrap a real organization (+ owner membership) for the
 * current Supabase user. Idempotent. Caches the resolved org id.
 *
 * Requires migration 003 (organizations + organization_members + is_org_member).
 */
import { supabase, SUPABASE_READY } from "@/lib/supabase/client";

let cachedOrgId: string | null = null;
let inflight: Promise<string | null> | null = null;

export function getCachedOrgId(): string | null {
  return cachedOrgId;
}

export function clearOrgBootstrapCache() {
  cachedOrgId = null;
  inflight = null;
}

export async function ensureOrganization(): Promise<string | null> {
  if (cachedOrgId) return cachedOrgId;
  if (inflight) return inflight;
  if (!SUPABASE_READY) return null;

  inflight = (async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

    // 1. Existing membership?
    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (membership?.organization_id) {
      cachedOrgId = membership.organization_id as string;
      return cachedOrgId;
    }

    // 2. Create organization owned by user.
    const displayName =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Workspace";

    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: `${displayName}'s Workspace`,
        slug: user.id.slice(0, 8),
        owner_id: user.id,
        plan: "free",
      })
      .select("id")
      .single();

    if (orgErr || !org) {
      console.warn("[bootstrap] could not create organization", orgErr);
      return null;
    }

    // 3. Membership row (owner).
    const { error: memErr } = await supabase.from("organization_members").insert({
      organization_id: org.id,
      user_id: user.id,
      role: "owner",
    });
    if (memErr) console.warn("[bootstrap] could not create membership", memErr);

    cachedOrgId = org.id as string;
    return cachedOrgId;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

/**
 * Ensures the org has at least one pipeline with default stages.
 * Returns the pipeline id (or null on failure).
 */
let cachedPipelineId: string | null = null;
export async function ensureDefaultPipeline(orgId: string): Promise<string | null> {
  if (cachedPipelineId) return cachedPipelineId;
  if (!SUPABASE_READY) return null;

  const { data: existing } = await supabase
    .from("crm_pipelines")
    .select("id")
    .eq("organization_id", orgId)
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    cachedPipelineId = existing.id as string;
    return cachedPipelineId;
  }

  const { data: created, error } = await supabase
    .from("crm_pipelines")
    .insert({ organization_id: orgId, name: "Default Pipeline", is_active: true })
    .select("id")
    .single();

  if (error || !created) {
    console.warn("[bootstrap] could not create default pipeline", error);
    return null;
  }

  const stages = [
    { name: "Prospecting", position: 1, probability: 10 },
    { name: "Qualification", position: 2, probability: 25 },
    { name: "Proposal", position: 3, probability: 50 },
    { name: "Negotiation", position: 4, probability: 75 },
    { name: "Closed Won", position: 5, probability: 100 },
  ];
  await supabase
    .from("crm_pipeline_stages")
    .insert(stages.map((s) => ({ ...s, pipeline_id: created.id })));

  cachedPipelineId = created.id as string;
  return cachedPipelineId;
}
