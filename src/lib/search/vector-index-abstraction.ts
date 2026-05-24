export interface VectorRecord {
  id: string;
  tenantId: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface VectorIndexProvider {
  upsert(records: VectorRecord[]): Promise<void>;
  query(tenantId: string, vector: number[], topK: number): Promise<Array<{ id: string; score: number }>>;
  remove(tenantId: string, ids: string[]): Promise<void>;
}

class InMemoryVectorIndex implements VectorIndexProvider {
  private store = new Map<string, VectorRecord>();

  async upsert(records: VectorRecord[]) {
    for (const r of records) this.store.set(`${r.tenantId}::${r.id}`, r);
  }

  async query(tenantId: string, vector: number[], topK: number) {
    const candidates = Array.from(this.store.values()).filter((r) => r.tenantId === tenantId);
    const scored = candidates.map((r) => ({ id: r.id, score: cosine(vector, r.vector) }));
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  async remove(tenantId: string, ids: string[]) {
    for (const id of ids) this.store.delete(`${tenantId}::${id}`);
  }
}

function cosine(a: number[], b: number[]) {
  if (a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

let provider: VectorIndexProvider = new InMemoryVectorIndex();

export function setVectorIndexProvider(p: VectorIndexProvider) {
  provider = p;
}

export function getVectorIndexProvider(): VectorIndexProvider {
  return provider;
}
