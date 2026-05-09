import type { StreakRepository } from '../../../application/ports/StreakRepository';
import type { StreakStatus } from '../../../domain/models/StreakStatus';

const MOCK_STATUS: StreakStatus = {
  currentStreak: 5,
  sessionsThisWeek: 1,
  sessionsRemaining: 2,
  hoursRemaining: 36,
  isAtRisk: true,
  target: 3,
};

export class MockStreakRepository implements StreakRepository {
  async getStatus(_token?: string): Promise<StreakStatus> {
    return { ...MOCK_STATUS };
  }
}
