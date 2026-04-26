import type { WeeklySummaryRepository } from '../../../application/ports/WeeklySummaryRepository';
import type { WeeklySummary } from '../../../domain/models/WeeklySummary';

export class MockWeeklySummaryRepository implements WeeklySummaryRepository {
  async getWeeklySummary(token: string): Promise<WeeklySummary> {
    void token;

    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      current: {
        daysTrained: 4,
        totalExercises: 22,
        totalVolume: 5120,
      },
      previous: {
        daysTrained: 3,
        totalExercises: 18,
        totalVolume: 4280,
      },
    };
  }
}
