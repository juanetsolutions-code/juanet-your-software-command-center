import type { Lead, Contact, Account, Deal, CrmActivity } from "./crm-entities";
import type { LeadStatus, LeadSource, DealStage, DealPriority, ActivityType } from "./crm-types";

type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateLead(lead: Partial<Lead>): ValidationResult {
  const errors: string[] = [];

  if (!lead.firstName?.trim()) errors.push("First name is required");
  if (!lead.lastName?.trim()) errors.push("Last name is required");
  if (!lead.email?.trim()) errors.push("Email is required");
  
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.push("Invalid email format");
  }
  
  if (lead.phone && !/^[\d\s\-\+\(\)]+$/.test(lead.phone)) {
    errors.push("Invalid phone format");
  }

  if (lead.score !== undefined && (lead.score < 0 || lead.score > 100)) {
    errors.push("Score must be between 0 and 100");
  }

  return { valid: errors.length === 0, errors };
}

export function validateContact(contact: Partial<Contact>): ValidationResult {
  const errors: string[] = [];

  if (!contact.firstName?.trim()) errors.push("First name is required");
  if (!contact.lastName?.trim()) errors.push("Last name is required");
  if (!contact.email?.trim()) errors.push("Email is required");

  if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errors.push("Invalid email format");
  }

  return { valid: errors.length === 0, errors };
}

export function validateAccount(account: Partial<Account>): ValidationResult {
  const errors: string[] = [];

  if (!account.name?.trim()) errors.push("Account name is required");

  if (account.website && !/^https?:\/\/.+/.test(account.website)) {
    errors.push("Website must be a valid URL");
  }

  if (account.numberOfEmployees !== undefined && account.numberOfEmployees < 0) {
    errors.push("Number of employees must be positive");
  }

  return { valid: errors.length === 0, errors };
}

export function validateDeal(deal: Partial<Deal>): ValidationResult {
  const errors: string[] = [];

  if (!deal.name?.trim()) errors.push("Deal name is required");
  if (deal.value === undefined || deal.value < 0) errors.push("Deal value must be non-negative");
  if (deal.probability !== undefined && (deal.probability < 0 || deal.probability > 100)) {
    errors.push("Probability must be between 0 and 100");
  }
  if (!deal.pipelineId) errors.push("Pipeline is required");

  return { valid: errors.length === 0, errors };
}

export function validateActivity(activity: Partial<CrmActivity>): ValidationResult {
  const errors: string[] = [];

  if (!activity.entityType) errors.push("Entity type is required");
  if (!activity.entityId) errors.push("Entity ID is required");
  if (!activity.type) errors.push("Activity type is required");
  if (!activity.subject?.trim()) errors.push("Subject is required");

  return { valid: errors.length === 0, errors };
}

export function isValidLeadStatus(status: string): status is LeadStatus {
  return ["new", "qualified", "contacted", "converted", "rejected"].includes(status);
}

export function isValidLeadSource(source: string): source is LeadSource {
  return ["website", "referral", "social", "email", "call", "event", "other"].includes(source);
}

export function isValidDealStage(stage: string): stage is DealStage {
  return ["prospecting", "qualification", "proposal", "negotiation", "closed_won", "closed_lost"].includes(stage);
}

export function isValidDealPriority(priority: string): priority is DealPriority {
  return ["low", "medium", "high", "critical"].includes(priority);
}

export function isValidActivityType(type: string): type is ActivityType {
  return ["call", "email", "meeting", "note", "task", "demo", "proposal"].includes(type);
}