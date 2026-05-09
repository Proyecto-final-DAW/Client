import type { Cards } from '@features/dashboard/core/domain/models/Cards';
import type { GetCardsDTO } from '../dtos/GetCardsDTO';

export class CardsFromDTO {
  static fromDTO(dto: GetCardsDTO): Cards {
    return {
      streak: dto.streak ?? 0,
      weeklyTarget: dto.weeklyTarget ?? 1,
      sessionsThisWeek: dto.sessionsThisWeek ?? 0,
      lastWorkoutDaysAgo: dto.lastWorkoutDaysAgo ?? 0,
      trainingDays: dto.trainingDays ?? [],
    };
  }
}
