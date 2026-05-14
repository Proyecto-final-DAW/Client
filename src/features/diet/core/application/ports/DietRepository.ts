import type { Diet } from '../../domain/models/Diet';
import type { DietLogResult } from '../../domain/models/DietLogGains';
import type { DietStreakState } from '../../domain/models/DietStreakState';

export interface DietRepository {
  getDiet(userId: number): Promise<Diet>;
  getStreakState(): Promise<DietStreakState>;
  logToday(): Promise<DietLogResult>;
}
