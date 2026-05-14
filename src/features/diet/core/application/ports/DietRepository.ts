import type { Diet } from '../../domain/models/Diet';

export interface DietRepository {
  getDiet(userId: number): Promise<Diet>;
}
