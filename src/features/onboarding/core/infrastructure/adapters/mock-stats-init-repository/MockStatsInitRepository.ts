import type { StatsInitPort } from '../../../application/ports/StatsInitPort';

export class MockStatsInitRepository implements StatsInitPort {
  async initStats(_token: string): Promise<void> {
    return;
  }
}
