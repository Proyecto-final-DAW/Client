import type { Cards } from '../../../../domain/models/Cards';
import type { GetCardsDTO } from '../dtos/GetCardsDTO';

export class CardsFromDTO {
  static fromDTO(dto: GetCardsDTO): Cards {
    const today = new Date();
    const lastSessionDate = dto.last_session_date
      ? new Date(dto.last_session_date)
      : null;

    let lastWorkoutDaysAgo = 0;

    if (lastSessionDate) {
      const diffMs = today.getTime() - lastSessionDate.getTime();
      lastWorkoutDaysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    return {
      streak: dto.streak,
      lastWorkoutDaysAgo,
      trainingDays: dto.training_days_this_month ?? [],
      stats: dto.stats,
    };
  }
}
