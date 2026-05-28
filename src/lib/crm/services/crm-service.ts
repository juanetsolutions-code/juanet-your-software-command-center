import { LeadRepository } from "../repository/lead-repository";
import { ContactRepository } from "../repository/contact-repository";
import { AccountRepository } from "../repository/account-repository";
import { DealRepository } from "../repository/deal-repository";
import { PipelineRepository } from "../repository/pipeline-repository";
import type { Lead, Contact, Account, Deal } from "../core/crm-entities";
import type { CrmFilter } from "../core/crm-entities";

export type CrmListResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

export type CrmSearchParams = {
  tenantId: string;
  query?: string;
  filter?: CrmFilter;
  limit?: number;
  offset?: number;
};

class CrmService {
  leads = new LeadRepository();
  contacts = new ContactRepository();
  accounts = new AccountRepository();
  deals = new DealRepository();
  pipelines = new PipelineRepository();

  async getLeads(params: CrmSearchParams): Promise<CrmListResult<Lead>> {
    return this.leads.query({
      tenantId: params.tenantId,
      filter: params.filter,
      limit: params.limit,
      offset: params.offset,
    });
  }

  async getContacts(params: CrmSearchParams): Promise<CrmListResult<Contact>> {
    return this.contacts.query({
      tenantId: params.tenantId,
      filter: params.filter,
      limit: params.limit,
      offset: params.offset,
    });
  }

  async getAccounts(params: CrmSearchParams): Promise<CrmListResult<Account>> {
    return this.accounts.query({
      tenantId: params.tenantId,
      filter: params.filter,
      limit: params.limit,
      offset: params.offset,
    });
  }

  async getDeals(params: CrmSearchParams): Promise<CrmListResult<Deal>> {
    return this.deals.query({
      tenantId: params.tenantId,
      filter: params.filter,
      limit: params.limit,
      offset: params.offset,
    });
  }
}

export const crmService = new CrmService();