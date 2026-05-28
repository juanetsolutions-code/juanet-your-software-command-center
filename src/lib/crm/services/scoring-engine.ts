import type { Lead } from "../core/crm-entities";

export type ScoringRule = {
  field: string;
  weight: number;
  condition: (value: unknown) => boolean;
  points: number;
};

export type LeadScore = {
  leadId: string;
  score: number;
  grade: "A" | "B" | "C" | "D";
  factors: string[];
};

export class ScoringEngine {
  private rules: ScoringRule[] = [
    {
      field: "company",
      weight: 20,
      condition: (v) => !!v,
      points: 20,
    },
    {
      field: "title",
      weight: 15,
      condition: (v) => !!v && String(v).length > 0,
      points: 15,
    },
    {
      field: "phone",
      weight: 10,
      condition: (v) => !!v,
      points: 10,
    },
  ];

  async scoreLead(lead: Lead): Promise<LeadScore> {
    let score = 50;
    const factors: string[] = [];

    for (const rule of this.rules) {
      const value = lead[rule.field as keyof Lead];
      if (rule.condition(value)) {
        score += rule.points;
        factors.push(rule.field);
      }
    }

    const grade = this.calculateGrade(score);

    return {
      leadId: lead.id,
      score,
      grade,
      factors,
    };
  }

  private calculateGrade(score: number): "A" | "B" | "C" | "D" {
    if (score >= 80) return "A";
    if (score >= 60) return "B";
    if (score >= 40) return "C";
    return "D";
  }

  async getAiReadiness(lead: Lead, score: number): Promise<boolean> {
    return !!lead.email && !!lead.company && score >= 60;
  }
}

export const scoringEngine = new ScoringEngine();