import type { Progress } from '../../domain/models/Progress';

export interface ProgressRepository {
  getWeightHistory(userId: string, token?: string): Promise<Progress[]>;
}
