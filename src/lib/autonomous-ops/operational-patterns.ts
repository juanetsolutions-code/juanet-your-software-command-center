/**
 * Operational Patterns
 * Discovers recurring operational patterns and signatures
 * for better prediction and pattern-based remediation preparation.
 */

export interface OperationalPattern {
  id: string;
  signature: string;
  frequency: number;
  averageRiskScore: number;
  commonTriggers: string[];
  successfulRemediations: string[];
  lastObserved: string;
}

export class OperationalPatterns {
  private patterns: OperationalPattern[] = [];

  recordObservation(signature: string, riskScore: number, triggers: string[]): void {
    let pat = this.patterns.find((p) => p.signature === signature);
    if (!pat) {
      pat = {
        id: `pat-${Date.now()}`,
        signature,
        frequency: 0,
        averageRiskScore: 0,
        commonTriggers: [],
        successfulRemediations: [],
        lastObserved: new Date().toISOString(),
      };
      this.patterns.push(pat);
    }
    pat.frequency += 1;
    pat.averageRiskScore = (pat.averageRiskScore * (pat.frequency - 1) + riskScore) / pat.frequency;
    pat.lastObserved = new Date().toISOString();
    triggers.forEach((t) => {
      if (!pat!.commonTriggers.includes(t)) pat!.commonTriggers.push(t);
    });
  }

  getTopPatterns(limit = 5): OperationalPattern[] {
    return [...this.patterns]
      .sort((a, b) => b.averageRiskScore - a.averageRiskScore)
      .slice(0, limit);
  }
}

export const operationalPatterns = new OperationalPatterns();
