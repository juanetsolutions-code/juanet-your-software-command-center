import type { LeadStatus, LeadSource, ContactType, AccountType, DealStage, DealPriority, ActivityType } from "./crm-types";

export type Lead = {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  source: LeadSource;
  status: LeadStatus;
  score?: number;
  value?: number;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  tags: string[];
};

export type Contact = {
  id: string;
  tenantId: string;
  leadId?: string;
  accountId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  type: ContactType;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Account = {
  id: string;
  tenantId: string;
  name: string;
  type: AccountType;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  numberOfEmployees?: number;
  annualRevenue?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Deal = {
  id: string;
  tenantId: string;
  leadId?: string;
  contactId?: string;
  accountId?: string;
  name: string;
  description?: string;
  value: number;
  stage: DealStage;
  priority: DealPriority;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  assignedTo?: string;
  pipelineId: string;
  createdAt: string;
  updatedAt: string;
};

export type Pipeline = {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  stages: Stage[];
  createdAt: string;
};

export type Stage = {
  id: string;
  pipelineId: string;
  name: string;
  position: number;
  probability: number;
  color?: string;
};

export type CrmActivity = {
  id: string;
  tenantId: string;
  entityType: "lead" | "contact" | "account" | "deal";
  entityId: string;
  type: ActivityType;
  subject: string;
  description?: string;
  userId?: string;
  duration?: number;
  outcome?: string;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
};

export type CrmFilter = {
  search?: string;
  status?: string;
  stage?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
  tags?: string[];
};