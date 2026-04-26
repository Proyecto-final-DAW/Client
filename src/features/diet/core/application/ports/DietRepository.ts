import type { Diet } from '../../domain/models/Diet';

export interface DietRepository {
  getDiet(userId: string, token?: string): Promise<Diet>;
}
