import type { StreakStatus } from '@features/streak/core/domain/models/StreakStatus';

import type { GetStreakStatusDTO } from '../dtos/GetStreakStatusDTO';

export class StreakStatusFromDTO {
  static fromDTO(dto: GetStreakStatusDTO): StreakStatus {
    return {
      currentStreak: dto.currentStreak,
      sessionsThisWeek: dto.sessionsThisWeek ?? 0,
      sessionsRemaining: dto.sessionsRemaining ?? 0,
      hoursRemaining: dto.hoursRemaining,
      isAtRisk: dto.isAtRisk,
      target: dto.target ?? 1,
    };
  }
}
