/**
 * Semantic Learning
 * Continuously learns and refines semantic relationships from usage.
 */

export interface LearnedRelationship {
  from: string;
  to: string;
  strength: number;
  learnedFrom: string;
}

export class SemanticLearning {
  private learned: LearnedRelationship[] = [];

  learn(from: string, to: string, strength: number): LearnedRelationship {
    const rel: LearnedRelationship = { from, to, strength, learnedFrom: "usage_pattern" };
    this.learned.push(rel);
    return rel;
  }
}

export const semanticLearning = new SemanticLearning();
