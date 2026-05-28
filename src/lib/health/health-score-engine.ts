export type HealthComponent = {
  name: string;
  weight: number;
  score: number;
};

export type HealthScore = {
  overall: number;
  components: HealthComponent[];
  timestamp: string;
};

class HealthScoreEngine {
  private components: Map<string, { weight: number; currentScore: number }> = new Map();

  registerComponent(name: string, weight: number): void {
    this.components.set(name, { weight, currentScore: 100 });
  }

  updateComponent(name: string, score: number): void {
    const component = this.components.get(name);
    if (component) {
      component.currentScore = score;
      this.components.set(name, component);
    }
  }

  calculateScore(): HealthScore {
    let totalWeight = 0;
    let weightedSum = 0;

    const componentScores: HealthComponent[] = [];

    for (const [name, { weight, currentScore }] of this.components) {
      totalWeight += weight;
      weightedSum += currentScore * weight;
      componentScores.push({ name, weight, score: currentScore });
    }

    return {
      overall: totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 100,
      components: componentScores,
      timestamp: new Date().toISOString(),
    };
  }

  getComponent(name: string): { weight: number; currentScore: number } | undefined {
    return this.components.get(name);
  }

  getAllComponents(): HealthComponent[] {
    return Array.from(this.components.entries()).map(([name, { weight, currentScore }]) => ({
      name,
      weight,
      score: currentScore,
    }));
  }
}

export const healthScoreEngine = new HealthScoreEngine();

export function registerHealthComponent(name: string, weight: number): void {
  healthScoreEngine.registerComponent(name, weight);
}

export function updateHealthComponent(name: string, score: number): void {
  healthScoreEngine.updateComponent(name, score);
}

export function getHealthScore(): HealthScore {
  return healthScoreEngine.calculateScore();
}