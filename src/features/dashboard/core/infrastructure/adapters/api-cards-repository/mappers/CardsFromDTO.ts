import type { Cards } from '../../../../domain/models/Cards';
import type { GetCardsDTO } from '../dtos/GetCardsDTO';

export class CardsFromDTO {
  static fromDTO(dto: GetCardsDTO): Cards {
    return {
      streak: dto.streak ?? 0,
      lastWorkoutDaysAgo: dto.lastWorkoutDaysAgo ?? 0,
      trainingDays: dto.trainingDays ?? [],
      stats: dto.stats,
    };
  }
}
