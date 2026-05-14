import type { StreakRepository } from '../../../application/ports/StreakRepository';
import type { StreakStatus } from '../../../domain/models/StreakStatus';

const MOCK_STATUS: StreakStatus = {
  currentStreak: 5,
  hoursRemaining: 12,
  isAtRisk: true,
};

export class MockStreakRepository implements StreakRepository {
  async getStatus(_token?: string): Promise<StreakStatus> {
    return { ...MOCK_STATUS };
  }
}
