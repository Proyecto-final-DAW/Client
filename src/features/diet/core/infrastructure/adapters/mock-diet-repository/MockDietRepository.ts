import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';

export class MockDietRepository implements DietRepository {
  async getDiet(_userId: string, _token?: string): Promise<Diet> {
    return {
      dailyCalories: '2200',
      proteinGrams: '150',
      fatGrams: '70',
      carbGrams: '250',
    };
  }
}
