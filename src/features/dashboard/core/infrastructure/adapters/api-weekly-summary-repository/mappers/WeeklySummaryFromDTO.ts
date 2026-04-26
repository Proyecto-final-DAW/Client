import type { WeeklySummary } from '../../../../domain/models/WeeklySummary';
import type { GetWeeklySummaryDTO } from '../dtos/GetWeeklySummaryDTO';

export class WeeklySummaryFromDTO {
  static fromDTO(dto: GetWeeklySummaryDTO): WeeklySummary {
    return {
      current: {
        daysTrained: dto.current.daysTrained,
        totalExercises: dto.current.totalExercises,
        totalVolume: dto.current.totalVolume,
      },
      previous: {
        daysTrained: dto.previous.daysTrained,
        totalExercises: dto.previous.totalExercises,
        totalVolume: dto.previous.totalVolume,
      },
    };
  }
}
