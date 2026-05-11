import type { Cards } from '@features/dashboard/core/domain/models/Cards';

import type { GetCardsDTO } from '../dtos/GetCardsDTO';

export class CardsFromDTO {
  static fromDTO(dto: GetCardsDTO): Cards {
    return {
      streak: dto.streak ?? 0,
      weeklyTarget: dto.weeklyTarget ?? 1,
      sessionsThisWeek: dto.sessionsThisWeek ?? 0,
      // Preserve null — server emits null specifically to signal
      // "never trained", and 0 is a meaningful value ("trained today").
      // Coercing null → 0 makes brand-new users appear as if they
      // worked out today.
      lastWorkoutDaysAgo: dto.lastWorkoutDaysAgo ?? null,
      trainingDays: dto.trainingDays ?? [],
    };
  }
}
