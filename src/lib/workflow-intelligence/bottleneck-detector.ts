/**
 * Workflow Intelligence Engine - Bottleneck Detector
 * Identifies steps that consistently cause delays or failures.
 */

export class BottleneckDetector {
  detect(executions: any[]): any[] {
    const stepTimes: Record<string, number[]> = {};

    executions.forEach((ex) => {
      ex.stepDurations?.forEach((sd: any) => {
        if (!stepTimes[sd.step]) stepTimes[sd.step] = [];
        stepTimes[sd.step].push(sd.duration);
      });
    });

    return Object.entries(stepTimes)
      .map(([step, times]) => ({
        step,
        avgDuration: times.reduce((a, b) => a + b, 0) / times.length,
        isBottleneck: Math.max(...times) > 30000,
      }))
      .filter((b) => b.isBottleneck);
  }
}

export const bottleneckDetector = new BottleneckDetector();
