export type LeadStatus = "new" | "qualified" | "contacted" | "converted" | "rejected";

export type LeadSource = "website" | "referral" | "social" | "email" | "call" | "event" | "other";

export type ContactType = "lead" | "customer" | "partner" | "vendor";

export type AccountType = "prospect" | "customer" | "partner" | "vendor" | "inactive";

export type DealStage = "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";

export type DealPriority = "low" | "medium" | "high" | "critical";

export type ActivityType = "call" | "email" | "meeting" | "note" | "task" | "demo" | "proposal";

export type CrmEntityType = "lead" | "contact" | "account" | "deal" | "pipeline" | "stage";