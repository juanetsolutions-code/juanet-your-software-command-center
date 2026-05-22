/**
 * Organization / tenant domain types.
 * Designed for future multi-tenant SaaS isolation.
 */

export type OrganizationPlan = "free" | "pro" | "enterprise";
export type OrganizationRole = "owner" | "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan;
  createdAt: string;
}

export interface OrganizationMembership {
  organizationId: string;
  profileId: string;
  role: OrganizationRole;
  createdAt: string;
}

/** Raw DB row shapes */
export interface DbOrganization {
  id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan | string;
  created_at: string;
}

export interface DbOrganizationMember {
  organization_id: string;
  profile_id: string;
  role: OrganizationRole | string;
  created_at: string;
}
