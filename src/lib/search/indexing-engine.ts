export interface IndexDocument {
  id: string;
  tenantId: string;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  updatedAt: string;
}

const index = new Map<string, IndexDocument>();

function k(tenantId: string, id: string) {
  return `${tenantId}::${id}`;
}

export function upsertDocument(doc: IndexDocument) {
  index.set(k(doc.tenantId, doc.id), doc);
}

export function removeDocument(tenantId: string, id: string) {
  index.delete(k(tenantId, id));
}

export function getAllForTenant(tenantId: string): IndexDocument[] {
  return Array.from(index.values()).filter((d) => d.tenantId === tenantId);
}
