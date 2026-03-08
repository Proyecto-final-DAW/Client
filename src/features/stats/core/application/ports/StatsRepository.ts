import type { UserStats } from '../../domain/models/UserStats';

export interface StatsRepository {
  getStats(token: string): Promise<UserStats>;
}
