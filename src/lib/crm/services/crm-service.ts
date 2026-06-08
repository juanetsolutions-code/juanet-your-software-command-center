// Minimal in-memory mock CRM service.
export const crmService = {
  contacts: {
    async create(params: any) {
      return { id: `contact_${Date.now()}`, ...params };
    },
    async query(_args: { tenantId: string }) {
      return { contacts: [] as Array<any>, total: 0, hasMore: false };
    },
  },
};
