import type { UserStats } from '../../domain/models/UserStats';

export interface StatsRepository {
  getStats(): Promise<UserStats>;
}
