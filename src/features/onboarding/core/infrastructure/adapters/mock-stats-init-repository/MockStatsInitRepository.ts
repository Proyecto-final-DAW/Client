import type { StatsInitRepository } from '../../../application/ports/StatsInitRepository';

export class MockStatsInitRepository implements StatsInitRepository {
  async initStats(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return;
  }
}
