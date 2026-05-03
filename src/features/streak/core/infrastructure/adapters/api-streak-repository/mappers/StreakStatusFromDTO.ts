import type { StreakStatus } from '../../../../domain/models/StreakStatus';
import type { GetStreakStatusDTO } from '../dtos/GetStreakStatusDTO';

export class StreakStatusFromDTO {
  static fromDTO(dto: GetStreakStatusDTO): StreakStatus {
    return {
      currentStreak: dto.currentStreak,
      hoursRemaining: dto.hoursRemaining,
      isAtRisk: dto.isAtRisk,
    };
  }
}
