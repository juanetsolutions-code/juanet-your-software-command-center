/**
 * Enterprise Accounts
 * Management of large / custom enterprise tenants.
 */

export interface EnterpriseAccount {
  tenantId: string;
  accountManager: string;
  contractStart: string;
  customTerms?: string;
  dedicatedSupport: boolean;
}

const enterpriseAccounts = new Map<string, EnterpriseAccount>();

export function registerEnterpriseAccount(account: EnterpriseAccount) {
  enterpriseAccounts.set(account.tenantId, account);
}

export function getEnterpriseAccount(tenantId: string) {
  return enterpriseAccounts.get(tenantId);
}
