import type { StreakStatus } from '../../domain/models/StreakStatus';

export interface StreakRepository {
  getStatus(token?: string): Promise<StreakStatus>;
}
