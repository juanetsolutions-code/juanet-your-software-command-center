/**
 * Semantic Memory
 * High-level conceptual and semantic knowledge extracted from episodes and long-term records.
 */

export interface SemanticConcept {
  id: string;
  tenantId: string;
  concept: string;
  relatedEpisodes: string[];
  abstractionLevel: number;
  confidence: number;
  lastReinforced: string;
}

export class SemanticMemory {
  private concepts: SemanticConcept[] = [];

  abstractFromEpisodes(tenantId: string, episodes: string[], conceptName: string): SemanticConcept {
    const c: SemanticConcept = {
      id: `sem-${Date.now()}`,
      tenantId,
      concept: conceptName,
      relatedEpisodes: episodes,
      abstractionLevel: 0.7,
      confidence: 0.65,
      lastReinforced: new Date().toISOString(),
    };
    this.concepts.push(c);
    return c;
  }

  getConcepts(tenantId: string): SemanticConcept[] {
    return this.concepts.filter((c) => c.tenantId === tenantId);
  }
}

export const semanticMemory = new SemanticMemory();
