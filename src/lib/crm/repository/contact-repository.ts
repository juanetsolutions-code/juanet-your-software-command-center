import type { Contact, CrmFilter } from "../core/crm-entities";

type ContactQueryParams = {
  tenantId: string;
  filter?: CrmFilter;
  limit?: number;
  offset?: number;
};

type ContactQueryResult = {
  contacts: Contact[];
  total: number;
  hasMore: boolean;
};

export class ContactRepository {
  private contacts: Map<string, Contact> = new Map();

  async create(data: Omit<Contact, "id" | "createdAt" | "updatedAt">): Promise<Contact> {
    const contact: Contact = {
      ...data,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contacts.set(contact.id, contact);
    return contact;
  }

  async findById(id: string, tenantId: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(id);
    if (!contact || contact.tenantId !== tenantId) return undefined;
    return contact;
  }

  async query(params: ContactQueryParams): Promise<ContactQueryResult> {
    let results = Array.from(this.contacts.values()).filter((c) => c.tenantId === params.tenantId);

    if (params.filter?.search) {
      const searchLower = params.filter.search.toLowerCase();
      results = results.filter((contact) =>
        contact.firstName.toLowerCase().includes(searchLower) ||
        contact.lastName.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        contact.company?.toLowerCase().includes(searchLower)
      );
    }

    const total = results.length;
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;
    
    results = results.slice(offset, offset + limit);

    return {
      contacts: results,
      total,
      hasMore: offset + limit < total,
    };
  }

  async update(id: string, tenantId: string, updates: Partial<Contact>): Promise<Contact | undefined> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return undefined;

    const updated: Contact = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.contacts.set(id, updated);
    return updated;
  }

  async delete(id: string, tenantId: string): Promise<boolean> {
    const contact = await this.findById(id, tenantId);
    if (!contact) return false;
    return this.contacts.delete(id);
  }

  private generateId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}