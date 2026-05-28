import type { Account, CrmFilter } from "../core/crm-entities";

type AccountQueryParams = {
  tenantId: string;
  filter?: CrmFilter;
  limit?: number;
  offset?: number;
};

type AccountQueryResult = {
  accounts: Account[];
  total: number;
  hasMore: boolean;
};

export class AccountRepository {
  private accounts: Map<string, Account> = new Map();

  async create(data: Omit<Account, "id" | "createdAt" | "updatedAt">): Promise<Account> {
    const account: Account = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.set(account.id, account);
    return account;
  }

  async findById(id: string, tenantId: string): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account || account.tenantId !== tenantId) return undefined;
    return account;
  }

  async query(params: AccountQueryParams): Promise<AccountQueryResult> {
    let results = Array.from(this.accounts.values()).filter((a) => a.tenantId === params.tenantId);

    if (params.filter?.search) {
      const searchLower = params.filter.search.toLowerCase();
      results = results.filter((account) =>
        account.name.toLowerCase().includes(searchLower) ||
        account.industry?.toLowerCase().includes(searchLower) ||
        account.website?.toLowerCase().includes(searchLower)
      );
    }

    const total = results.length;
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;
    
    results = results.slice(offset, offset + limit);

    return {
      accounts: results,
      total,
      hasMore: offset + limit < total,
    };
  }

  async update(id: string, tenantId: string, updates: Partial<Account>): Promise<Account | undefined> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return undefined;

    const updated: Account = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.accounts.set(id, updated);
    return updated;
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const account = await this.findById(id, tenantId);
    if (!account) return false;
    return this.accounts.delete(id);
  }

  private generateId(): string {
    return `account_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}