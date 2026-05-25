/**
 * Execution Strategies
 * Different orchestration strategies for AI execution plans.
 */

export interface ExecutionStrategy {
  name: string;
  description: string;
  characteristics: string[];
  riskTolerance: number;
  parallelism: number;
}

export const executionStrategies: ExecutionStrategy[] = [
  {
    name: "conservative",
    description: "Sequential, high-validation, human checkpoints",
    characteristics: ["low_risk", "auditable", "slow"],
    riskTolerance: 0.2,
    parallelism: 1,
  },
  {
    name: "balanced",
    description: "Mixed parallel where safe, adaptive checkpoints",
    characteristics: ["medium_risk", "efficient"],
    riskTolerance: 0.45,
    parallelism: 2,
  },
  {
    name: "aggressive",
    description: "High parallelism, fast feedback loops",
    characteristics: ["high_risk", "fast"],
    riskTolerance: 0.75,
    parallelism: 4,
  },
];

export class ExecutionStrategies {
  selectStrategy(riskTolerance: number): ExecutionStrategy {
    return (
      executionStrategies.find((s) => s.riskTolerance >= riskTolerance) || executionStrategies[1]
    );
  }
}

export const executionStrategiesManager = new ExecutionStrategies();
