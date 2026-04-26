import type { Diet } from '../../../../domain/models/Diet';
import type { GetDietDTO } from '../dtos/GetDietDTO';

export class DietFromDTO {
  static fromDTO(dto: GetDietDTO): Diet {
    return {
      dailyCalories: dto.daily_calories,
      proteinGrams: dto.protein_grams,
      fatGrams: dto.fat_grams,
      carbGrams: dto.carb_grams,
    };
  }
}
