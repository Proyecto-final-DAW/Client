import type { DietRepository } from '../../../application/ports/DietRepository';
import type { Diet } from '../../../domain/models/Diet';

const MOCK_DIET: Diet = {
  dailyCalories: 2200,
  proteinGrams: 150,
  fatGrams: 70,
  carbGrams: 250,
};

export class MockDietRepository implements DietRepository {
  async getDiet(_userId: number, _token?: string): Promise<Diet> {
    return { ...MOCK_DIET };
  }
}
